import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, CheckCircle, AlertCircle } from 'lucide-react';

export default function DataMigration() {
  const { data: session } = useSession();
  const { favoriteNames, recentCalculations, searchHistory, preferences, exportData } = useAppStore();
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const hasLocalData = favoriteNames.length > 0 || recentCalculations.length > 0 || searchHistory.length > 0;

  const handleMigrateData = async () => {
    if (!session) return;

    setIsMigrating(true);
    setMigrationStatus('idle');

    try {
      const localData = {
        favoriteNames,
        recentCalculations,
        searchHistory,
        preferences
      };

      const response = await fetch('/api/user/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(localData),
      });

      if (response.ok) {
        setMigrationStatus('success');
        // Clear local data after successful migration
        localStorage.removeItem('baby-names-storage');
        window.location.reload();
      } else {
        setMigrationStatus('error');
      }
    } catch (error) {
      console.error('Migration error:', error);
      setMigrationStatus('error');
    } finally {
      setIsMigrating(false);
    }
  };

  const handleExportLocalData = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `local-data-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!session) {
    return null;
  }

  if (!hasLocalData) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Data Synced
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Your data is now safely stored in the cloud and will never be lost!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertCircle className="h-5 w-5" />
          Migrate Local Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-orange-700">
          <p className="mb-2">You have local data that can be migrated to your account:</p>
          <ul className="list-disc list-inside space-y-1">
            {favoriteNames.length > 0 && <li>{favoriteNames.length} favorite names</li>}
            {recentCalculations.length > 0 && <li>{recentCalculations.length} recent calculations</li>}
            {searchHistory.length > 0 && <li>{searchHistory.length} search history items</li>}
          </ul>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleMigrateData}
            disabled={isMigrating}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {isMigrating ? 'Migrating...' : 'Migrate to Cloud'}
          </Button>

          <Button
            onClick={handleExportLocalData}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Backup
          </Button>
        </div>

        {migrationStatus === 'success' && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="h-4 w-4" />
            Data migrated successfully! Your local data is now safely stored in the cloud.
          </div>
        )}

        {migrationStatus === 'error' && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            Migration failed. Please try again or export your data as a backup.
          </div>
        )}

        <div className="text-xs text-orange-600 bg-orange-100 p-3 rounded">
          <strong>Note:</strong> After migration, your data will be permanently stored in the cloud 
          and accessible from any device. Local data will be cleared to avoid duplicates.
        </div>
      </CardContent>
    </Card>
  );
}
