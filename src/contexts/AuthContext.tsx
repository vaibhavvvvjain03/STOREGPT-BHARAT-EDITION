import React, { createContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { User, AuthContextType } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      const storedUser = localStorage.getItem('storegpt_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('storegpt_user');
        }
      }
      setLoading(false);
    };

    loadUserFromStorage();

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          try {
            const { data: profile, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (!error && profile) {
              setUser(profile);
              localStorage.setItem('storegpt_user', JSON.stringify(profile));
            } else if (event === 'SIGNED_IN' && !profile) {
              // Handle OAuth users (like GitHub) who don't have a profile yet
              const userMetadata = session.user.user_metadata;
              const newUser: User = {
                id: session.user.id,
                email: session.user.email || userMetadata?.email || '',
                shop_name: userMetadata?.full_name || userMetadata?.name || userMetadata?.preferred_username || 'My Store',
                preferred_language: 'en',
                festival_mode_enabled: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              
              // Try to create profile in database
              try {
                await supabase.from('users').insert([newUser]);
              } catch (insertError) {
                // If insert fails (e.g., demo mode), just use in-memory user
                if (isSupabaseConfigured) {
                  console.warn('Profile creation failed:', insertError);
                }
              }
              
              setUser(newUser);
              localStorage.setItem('storegpt_user', JSON.stringify(newUser));
            }
          } catch (err) {
            console.error('Error fetching profile:', err);
            // Fallback for OAuth users
            if (session.user) {
              const userMetadata = session.user.user_metadata;
              const fallbackUser: User = {
                id: session.user.id,
                email: session.user.email || userMetadata?.email || '',
                shop_name: userMetadata?.full_name || userMetadata?.name || 'My Store',
                preferred_language: 'en',
                festival_mode_enabled: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              setUser(fallbackUser);
              localStorage.setItem('storegpt_user', JSON.stringify(fallbackUser));
            }
          }
        } else {
          setUser(null);
          localStorage.removeItem('storegpt_user');
        }
      });

      return () => subscription?.unsubscribe();
    } catch (error) {
      console.error('Auth state change listener error:', error);
    }
  }, []);

  const signUp = async (email: string, password: string, shopName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        // Demo mode: allow signup without Supabase
        if (isSupabaseConfigured) {
          console.warn('Supabase signup failed:', error);
        }
        const newUser: User = {
          id: `demo-${Date.now()}`,
          email,
          shop_name: shopName,
          preferred_language: 'en',
          festival_mode_enabled: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(newUser);
        localStorage.setItem('storegpt_user', JSON.stringify(newUser));
        return;
      }

      if (data.user) {
        try {
          await supabase.from('users').insert([
            {
              id: data.user.id,
              email,
              shop_name: shopName,
              preferred_language: 'en',
              festival_mode_enabled: false,
            },
          ]);
        } catch (profileError) {
          if (isSupabaseConfigured) {
            console.warn('Profile creation failed:', profileError);
          }
        }

        const newUser: User = {
          id: data.user.id,
          email,
          shop_name: shopName,
          preferred_language: 'en',
          festival_mode_enabled: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(newUser);
        localStorage.setItem('storegpt_user', JSON.stringify(newUser));
      }
    } catch (err) {
      // Fallback to demo mode
      if (isSupabaseConfigured) {
        console.error('Signup error:', err);
      }
      const newUser: User = {
        id: `demo-${Date.now()}`,
        email,
        shop_name: shopName,
        preferred_language: 'en',
        festival_mode_enabled: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem('storegpt_user', JSON.stringify(newUser));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // Demo mode: allow signin without Supabase
        if (isSupabaseConfigured) {
          console.warn('Supabase signin failed:', error);
        }
        const demoUser: User = {
          id: `demo-${Date.now()}`,
          email,
          shop_name: 'Demo Store',
          preferred_language: 'en',
          festival_mode_enabled: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(demoUser);
        localStorage.setItem('storegpt_user', JSON.stringify(demoUser));
        return;
      }

      if (data.user) {
        try {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

          if (profile) {
            setUser(profile);
            localStorage.setItem('storegpt_user', JSON.stringify(profile));
          } else {
            throw new Error('Profile not found');
          }
        } catch (profileError) {
          console.warn('Profile fetch failed:', profileError);
          const fallbackUser: User = {
            id: data.user.id,
            email: data.user.email || '',
            shop_name: 'My Store',
            preferred_language: 'en',
            festival_mode_enabled: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setUser(fallbackUser);
          localStorage.setItem('storegpt_user', JSON.stringify(fallbackUser));
        }
      }
    } catch (err) {
      // Fallback to demo mode
      if (isSupabaseConfigured) {
        console.error('Signin error:', err);
      }
      const demoUser: User = {
        id: `demo-${Date.now()}`,
        email,
        shop_name: 'Demo Store',
        preferred_language: 'en',
        festival_mode_enabled: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser(demoUser);
      localStorage.setItem('storegpt_user', JSON.stringify(demoUser));
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Signout error:', error);
    }
    setUser(null);
    localStorage.removeItem('storegpt_user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('users')
      .update(data)
      .eq('id', user.id);

    if (error) throw error;

    const updatedUser = { ...user, ...data, updated_at: new Date().toISOString() };
    setUser(updatedUser);
    localStorage.setItem('storegpt_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
