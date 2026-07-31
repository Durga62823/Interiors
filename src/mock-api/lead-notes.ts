import { supabase } from '@/lib/supabase';
import { LeadNote } from '@/types/admin';

interface LeadNoteRow {
  id: string;
  lead_id: string;
  note: string;
  author: string;
  created_at: string;
}

function fromRow(row: LeadNoteRow): LeadNote {
  return {
    id: row.id,
    leadId: row.lead_id,
    note: row.note,
    author: row.author,
    createdAt: row.created_at,
  };
}

/** Fetch all notes for a lead, newest first */
export const getLeadNotes = async (leadId: string): Promise<LeadNote[]> => {
  const { data, error } = await supabase
    .from('lead_notes')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as LeadNoteRow[]).map(fromRow);
};

/** Add a new note to a lead */
export const addLeadNote = async (
  leadId: string,
  note: string,
  author = 'Admin'
): Promise<LeadNote> => {
  const { data, error } = await supabase
    .from('lead_notes')
    .insert([{ lead_id: leadId, note, author }])
    .select()
    .single();
  if (error) throw error;
  return fromRow(data as LeadNoteRow);
};

/** Delete a single note */
export const deleteLeadNote = async (id: string): Promise<void> => {
  const { error } = await supabase.from('lead_notes').delete().eq('id', id);
  if (error) throw error;
};
