import { useAtom } from 'jotai';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '../lib/api';
import { userAtom, clearAuthAtom } from '../state/auth';
import { useSetAtom } from 'jotai';
import { useState } from 'react';

type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function NotesPage() {
  const [user] = useAtom(userAtom);
  const setClear = useSetAtom(clearAuthAtom);
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const notesQuery = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data } = await api.get<{ notes: Note[] }>('/notes');
      return data.notes;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { title: string; content: string }) => {
      const { data } = await api.post('/notes', payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
    onError: (e) => setError(getErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/notes/${id}`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
    onError: (e) => setError(getErrorMessage(e)),
  });

  return (
    <div className="notes-container">
      <header className="notes-header">
        <div>
          <h2>Hi, {user?.name}</h2>
          <p>{user?.email}</p>
        </div>
        <button onClick={() => setClear()}>Log out</button>
      </header>

      <CreateNote onCreate={(p) => createMutation.mutate(p)} creating={createMutation.isPending} />
      {error && <div className="server-msg">{error}</div>}
      {notesQuery.isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul className="notes-list">
          {notesQuery.data?.map((n) => (
            <li key={n._id} className="note-item">
              <div>
                <h4>{n.title}</h4>
                <p>{n.content}</p>
              </div>
              <button onClick={() => deleteMutation.mutate(n._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CreateNote({ onCreate, creating }: { onCreate: (p: { title: string; content: string }) => void; creating: boolean }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  return (
    <form
      className="card"
      onSubmit={(e) => {
        e.preventDefault();
        onCreate({ title: title || 'Untitled', content });
        setTitle('');
        setContent('');
      }}
    >
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write a note..." />
      <button disabled={creating} type="submit">{creating ? 'Creating...' : 'Create'}</button>
    </form>
  );
}


