import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { Download, Upload, Trash2, Database, AlertTriangle } from 'lucide-react';

export default function DataManagement() {
  const { exportData, importData, clearAllData, favoriteNames, recentCalculations, searchHistory } = useAppStore();
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `baby-names-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importText.trim()) {
      setImportStatus('error');
      return;
    }

    const success = importData(importText);
    setImportStatus(success ? 'success' : 'error');
    
    if (success) {
      setImportText('');
      setTimeout(() => setImportStatus('idle'), 3000);
    }
  };

  const handleClearAll = () => {
    clearAllData();
    setShowClearConfirm(false);
  };

  const stats = {
    favorites: favoriteNames.length,
    recent: recentCalculations.length,
    history: searchHistory.length
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.favorites}</div>
              <div className="text-sm text-gray-600">Favorite Names</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.recent}</div>
              <div className="text-sm text-gray-600">Recent Calculations</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.history}</div>
              <div className="text-sm text-gray-600">Search History</div>
            </div>
          </div>

          {/* Export Data */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Export Your Data</h3>
            <p className="text-sm text-gray-600">
              Download a backup of all your favorite names, recent calculations, and search history.
            </p>
            <Button onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>

          {/* Import Data */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Import Data</h3>
            <p className="text-sm text-gray-600">
              Restore your data from a previously exported backup file.
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste your backup data here..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-32 text-sm font-mono"
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleImport} 
                variant="outline"
                className="flex items-center gap-2"
                disabled={!importText.trim()}
              >
                <Upload className="h-4 w-4" />
                Import Data
              </Button>
              {importStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  ✓ Data imported successfully!
                </div>
              )}
              {importStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  ✗ Failed to import data. Please check the format.
                </div>
              )}
            </div>
          </div>

          {/* Clear All Data */}
          <div className="space-y-3 border-t pt-6">
            <h3 className="font-semibold text-gray-900 text-red-600">Danger Zone</h3>
            <p className="text-sm text-gray-600">
              Permanently delete all your data including favorites, recent calculations, and search history.
            </p>
            
            {!showClearConfirm ? (
              <Button 
                onClick={() => setShowClearConfirm(true)}
                variant="outline"
                className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </Button>
            ) : (
              <div className="space-y-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-semibold">Are you sure?</span>
                </div>
                <p className="text-sm text-red-700">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleClearAll}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Yes, Delete Everything
                  </Button>
                  <Button 
                    onClick={() => setShowClearConfirm(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">About Data Storage</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your data is automatically saved to your browser&apos;s local storage</li>
              <li>• Data persists across browser sessions and page refreshes</li>
              <li>• Clearing browser cache will delete your data unless you export it first</li>
              <li>• Use the export feature to create backups you can restore later</li>
              <li>• Data is stored locally and never sent to external servers</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
