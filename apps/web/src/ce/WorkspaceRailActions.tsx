'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { workspaceTileClass } from '@/components/layout/utils/workspaceTile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCreateWorkspace } from '@/services/workspaces.service';
import { workspacePath } from '@/utils/paths';

function useOptionalRouter() {
  try {
    return useRouter();
  } catch {
    return null;
  }
}

export default function WorkspaceRailActions() {
  const t = useTranslations('teams.workspace');
  const tCommon = useTranslations('common');
  const router = useOptionalRouter();
  const createWorkspace = useCreateWorkspace();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const trimmed = name.trim();
  const canSubmit = !createWorkspace.isPending && trimmed.length > 0 && trimmed.length <= 60;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    createWorkspace.mutate(
      { name: trimmed },
      {
        onSuccess: (workspace) => {
          setOpen(false);
          setName('');
          if (router) {
            router.push(workspacePath(workspace.id));
          } else if (typeof window !== 'undefined') {
            window.location.assign(workspacePath(workspace.id));
          }
        },
      },
    );
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setName('');
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button type="button" aria-label={t('create')} className={workspaceTileClass(false)}>
              <Plus className="size-4" />
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="right">{t('create')}</TooltipContent>
      </Tooltip>
      <PopoverContent side="right" align="start" className="w-64 p-3 text-sm">
        <form onSubmit={handleSubmit} className="space-y-3">
          <p className="font-medium">{t('create')}</p>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('info.workspace')}
            maxLength={60}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setOpen(false);
                setName('');
              }}
            >
              {tCommon('cancel')}
            </Button>
            <Button type="submit" size="sm" disabled={!canSubmit}>
              {tCommon('add')}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
