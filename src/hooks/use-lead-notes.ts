import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeadNotes, addLeadNote, deleteLeadNote } from '@/mock-api/lead-notes';
import { toast } from 'sonner';

/** Fetch all notes for a lead. Only runs when leadId is provided. */
export function useLeadNotes(leadId: string | null | undefined) {
  return useQuery({
    queryKey: ['lead-notes', leadId],
    queryFn: () => getLeadNotes(leadId!),
    enabled: !!leadId,
    throwOnError: false,
  });
}

/** Add a note to a lead and invalidate the notes cache for that lead. */
export function useAddLeadNote(leadId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ note, author }: { note: string; author?: string }) =>
      addLeadNote(leadId, note, author),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-notes', leadId] });
    },
    onError: () => {
      toast.error('Failed to save note. Please try again.');
    },
  });
}

/** Delete a note by id and refresh the notes list for that lead. */
export function useDeleteLeadNote(leadId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteId: string) => deleteLeadNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-notes', leadId] });
    },
    onError: () => {
      toast.error('Failed to delete note.');
    },
  });
}
