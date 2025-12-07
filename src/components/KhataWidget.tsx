import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Trash2, Edit2, Save, X, TrendingUp } from 'lucide-react';
import { useSpeechRecognition } from 'react-speech-recognition';

interface LedgerEntry {
  id: number;
  name: string;
  amount: number;
  timestamp: number;
}

const getInitialEntries = (): LedgerEntry[] => {
  const data = localStorage.getItem('khata-entries');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      // Ensure all entries have timestamp
      return parsed.map((entry: LedgerEntry) => ({
        ...entry,
        timestamp: entry.timestamp || entry.id || Date.now(),
      }));
    } catch {
      return [];
    }
  }
  return [];
};

interface KhataWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KhataWidget: React.FC<KhataWidgetProps> = ({ isOpen, onClose }) => {
  const [entries, setEntries] = useState<LedgerEntry[]>(getInitialEntries());
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState<number>(0);
  const [error, setError] = useState('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    localStorage.setItem('khata-entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
      const parsed = parseEntry(transcript);
      if (parsed) {
        addEntry(parsed.name, parsed.amount);
        setError('');
        resetTranscript();
      } else {
        setError('Could not parse: ' + transcript);
        setTimeout(() => setError(''), 3000);
      }
    }
  }, [transcript, resetTranscript]);


  // Enhanced NLP: extract name and amount from natural language input
  const parseEntry = (text: string): { name: string; amount: number } | null => {
    if (!text.trim()) return null;
    
    // Remove common words and clean up
    const cleaned = text.toLowerCase().trim();
    
    // Pattern 1: "Name Amount" or "Name Rs Amount" or "Name ₹ Amount"
    let match = cleaned.match(/([a-zA-Z\s]+?)\s+(?:rs|rupees?|₹|rs\.)?\s*(\d+(?:\.\d+)?)/i);
    if (match) {
      return { 
        name: match[1].trim().replace(/\s+/g, ' '), 
        amount: parseFloat(match[2]) 
      };
    }
    
    // Pattern 2: "Amount for Name" or "Amount Name"
    match = cleaned.match(/(\d+(?:\.\d+)?)\s+(?:for|to|from)\s+([a-zA-Z\s]+)/i);
    if (match) {
      return { 
        name: match[2].trim().replace(/\s+/g, ' '), 
        amount: parseFloat(match[1]) 
      };
    }
    
    // Pattern 3: "Amount Name" (number first)
    match = cleaned.match(/(\d+(?:\.\d+)?)\s+([a-zA-Z\s]+)/);
    if (match) {
      return { 
        name: match[2].trim().replace(/\s+/g, ' '), 
        amount: parseFloat(match[1]) 
      };
    }
    
    // Pattern 4: "Name Amount" (name first, number last)
    match = cleaned.match(/([a-zA-Z\s]+)\s+(\d+(?:\.\d+)?)/);
    if (match) {
      return { 
        name: match[1].trim().replace(/\s+/g, ' '), 
        amount: parseFloat(match[2]) 
      };
    }
    
    return null;
  };

  // Voice input using Web Speech API
  const handleStartListening = () => {
    if (!browserSupportsSpeechRecognition) {
      setError('Speech recognition not supported in your browser');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        const parsed = parseEntry(transcript);
        if (parsed) {
          addEntry(parsed.name, parsed.amount);
          setError('');
        } else {
          setError('Could not parse: ' + transcript);
          setTimeout(() => setError(''), 3000);
        }
      };
      recognition.start();
    }
  };

  const handleStopListening = () => {
    // Not needed, handled by recognition instance
  };

  const addEntry = (name: string, amount: number) => {
    if (!name.trim() || amount <= 0) {
      setError('Please provide a valid name and amount');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    setEntries((prev) => [
      ...prev,
      { id: Date.now(), name: name.trim(), amount, timestamp: Date.now() },
    ]);
    setInput('');
    setError('');
  };

  const deleteEntry = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const startEdit = (entry: LedgerEntry) => {
    setEditId(entry.id);
    setEditName(entry.name);
    setEditAmount(entry.amount);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
    setEditAmount(0);
  };

  const saveEdit = () => {
    if (!editName.trim() || editAmount <= 0) {
      setError('Please provide a valid name and amount');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    setEntries((prev) =>
      prev.map((e) =>
        e.id === editId ? { ...e, name: editName.trim(), amount: editAmount } : e
      )
    );
    cancelEdit();
    setError('');
  };

  // Calculate totals and running balance
  const total = entries.reduce((sum, e) => sum + e.amount, 0);
  const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);
  
  // Calculate running balance for each entry
  const entriesWithBalance = sortedEntries.map((entry, index) => {
    const previousBalance = index === 0 ? 0 : 
      sortedEntries.slice(0, index).reduce((sum, e) => sum + e.amount, 0);
    return {
      ...entry,
      runningBalance: previousBalance + entry.amount,
    };
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 dark:bg-black/50 light-mode:bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Glassy Side Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col"
        >
          <div className="h-full overflow-hidden flex flex-col bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80 dark:from-gray-900/80 dark:via-gray-800/70 dark:to-gray-900/80 light-mode:from-orange-50/95 light-mode:via-white/90 light-mode:to-orange-50/95 backdrop-blur-2xl border-l border-white/10 dark:border-white/10 light-mode:border-orange-300/40 shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-white/10 dark:border-white/10 light-mode:border-orange-300/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/10 dark:to-red-500/10 light-mode:from-orange-200/50 light-mode:to-orange-300/50">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
                  Khata (Voice Ledger)
                </h2>
                <button 
                  onClick={onClose} 
                  className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-white/10 light-mode:hover:bg-orange-200/50 text-white dark:text-white light-mode:text-gray-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-400 light-mode:text-gray-600">Voice-powered ledger entries</p>
            </div>

            {/* Input Section */}
            <div className="p-6 border-b border-white/10 dark:border-white/10 light-mode:border-orange-300/30 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/5 dark:bg-white/5 light-mode:bg-white/60 backdrop-blur-xl border border-orange-500/30 dark:border-orange-500/30 light-mode:border-orange-400/50 text-white dark:text-white light-mode:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light-mode:placeholder-gray-500 focus:outline-none focus:border-orange-500/60 dark:focus:border-orange-500/60 light-mode:focus:border-orange-600 focus:bg-white/10 dark:focus:bg-white/10 light-mode:focus:bg-white/80 transition-all"
                  placeholder="e.g., 'Raj Kumar 500' or '500 rupees for Raj'"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setError('');
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const parsed = parseEntry(input);
                      if (parsed) {
                        addEntry(parsed.name, parsed.amount);
                      } else {
                        setError('Could not parse entry. Try: "Name Amount"');
                        setTimeout(() => setError(''), 3000);
                      }
                    }
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={listening ? handleStopListening : handleStartListening}
                  className={`p-3 rounded-lg transition-all ${
                    listening 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-orange-500/30 hover:bg-orange-500/50 border border-orange-500/50'
                  } text-white`}
                  title={listening ? 'Stop listening' : 'Start voice input'}
                >
                  <Mic className={`w-5 h-5 ${listening ? 'animate-pulse' : ''}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const parsed = parseEntry(input);
                    if (parsed) {
                      addEntry(parsed.name, parsed.amount);
                    } else {
                      setError('Could not parse entry. Try: "Name Amount"');
                      setTimeout(() => setError(''), 3000);
                    }
                  }}
                  className="p-3 rounded-lg bg-green-500/30 hover:bg-green-500/50 border border-green-500/50 text-white transition-all"
                  title="Add entry"
                >
                  <Save className="w-5 h-5" />
                </motion.button>
              </div>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2 bg-red-500/20 dark:bg-red-500/20 light-mode:bg-red-100 border border-red-500/30 dark:border-red-500/30 light-mode:border-red-400 rounded-lg text-red-300 dark:text-red-300 light-mode:text-red-700 text-sm"
                >
                  {error}
                </motion.div>
              )}
              
              {listening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-orange-400 dark:text-orange-400 light-mode:text-orange-600 text-sm"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Listening...
                </motion.div>
              )}
            </div>

            {/* Entries List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              {entries.length === 0 ? (
                <div className="text-center py-12 text-gray-400 dark:text-gray-400 light-mode:text-gray-600">
                  <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No entries yet.</p>
                  <p className="text-sm mt-2">Use voice or text input to add entries</p>
                </div>
              ) : (
                entriesWithBalance.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel p-4 rounded-lg border border-white/10 dark:border-white/10 light-mode:border-orange-300/30 hover:border-orange-500/30 dark:hover:border-orange-500/30 light-mode:hover:border-orange-500/50 transition-all"
                  >
                    {editId === entry.id ? (
                      <div className="space-y-2">
                        <input
                          className="w-full px-3 py-2 rounded bg-white/5 dark:bg-white/5 light-mode:bg-white/60 border border-white/10 dark:border-white/10 light-mode:border-orange-300/40 text-white dark:text-white light-mode:text-gray-900 focus:outline-none focus:border-orange-500/50 dark:focus:border-orange-500/50 light-mode:focus:border-orange-600"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Name"
                        />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            className="flex-1 px-3 py-2 rounded bg-white/5 dark:bg-white/5 light-mode:bg-white/60 border border-white/10 dark:border-white/10 light-mode:border-orange-300/40 text-white dark:text-white light-mode:text-gray-900 focus:outline-none focus:border-orange-500/50 dark:focus:border-orange-500/50 light-mode:focus:border-orange-600"
                            value={editAmount}
                            onChange={(e) => setEditAmount(Number(e.target.value))}
                            placeholder="Amount"
                            min="0"
                            step="0.01"
                          />
                          <button 
                            onClick={saveEdit} 
                            className="p-2 rounded bg-green-500/30 hover:bg-green-500/50 text-green-300 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={cancelEdit} 
                            className="p-2 rounded bg-red-500/30 hover:bg-red-500/50 text-red-300 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white dark:text-white light-mode:text-gray-900 truncate">{entry.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-orange-300 dark:text-orange-300 light-mode:text-orange-600 font-medium">₹{entry.amount.toFixed(2)}</span>
                            <span className="text-xs text-gray-400 dark:text-gray-400 light-mode:text-gray-600">
                              Balance: ₹{entry.runningBalance.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-2">
                          <button 
                            onClick={() => startEdit(entry)} 
                            className="p-2 rounded hover:bg-blue-500/20 text-blue-40.0 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteEntry(entry.id)} 
                            className="p-2 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer with Total */}
            <div className="p-6 border-t border-white/10 dark:border-white/10 light-mode:border-orange-300/30 bg-gradient-to-r from-gray-900/50 to-gray-800/50 dark:from-gray-900/50 dark:to-gray-800/50 light-mode:from-orange-100/60 light-mode:to-orange-200/60">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-300 dark:text-gray-300 light-mode:text-gray-700 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400 dark:text-green-400 light-mode:text-green-600" />
                  Total Amount
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 dark:from-orange-400 dark:to-orange-600 light-mode:from-orange-600 light-mode:to-orange-700 bg-clip-text text-transparent">
                  ₹{total.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-400 light-mode:text-gray-600">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
