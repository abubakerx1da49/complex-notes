/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Button, Card, CardFooter, CardHeader, Chip, Image, Link, Textarea } from '@nextui-org/react';
import { LightningBoltIcon, Pencil2Icon, PlusIcon, ReaderIcon, TrashIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';

interface Note {
  id: number;
  content: string;
  htmlContent: string;
}

const Home: React.FC = () => {
  if (!global?.window) return null;

  const [newNote, setNewNote] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>(window.localStorage.getItem('all-complex-notes') != undefined ? JSON.parse(String(window.localStorage.getItem('all-complex-notes'))) : []);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  const handleCreateNote = async () => {
    if (newNote.trim() !== '') {
      if (editingNoteId !== null) {
        // Update existing note
        const code = await remark().use(html).process(String(newNote))
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === editingNoteId ? { ...note, content: newNote, htmlContent: code.toString() } : note
          )
        );
        setEditingNoteId(null);
      } else {
        const code = await remark().use(html).process(String(newNote))
        // Create new note
        setNotes((prevNotes) => [
          ...prevNotes,
          { id: Date.now(), content: newNote, htmlContent: code.toString() },
        ]);
      }
      setNewNote('');
      window.localStorage.setItem('all-complex-notes', JSON.stringify([...notes, newNote]))
    }
  };

  const handleEdit = (id: number) => {
    const noteToEdit = notes.find((note) => note.id === id);
    if (noteToEdit) {
      setNewNote(noteToEdit.content);
      setEditingNoteId(id);
    }
  };

  const handleDelete = (id: number) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    setEditingNoteId(null);
  };

  // Update local storage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem('all-complex-notes', JSON.stringify(notes));
  }, [notes]);

  return (
    <div className='w-screen h-screen flex items-center justify-center py-2 md:p-10 2xl:p-20 overflow-x-hidden text-sm md:text-base'>
      <div className='p-2 pb-8 w-full xl:4/5 2xl:w-3/5 h-full'>
        <Card className="w-full">
          <CardHeader className="flex gap-3">
            <Image
              alt="Complex Notes Logo"
              height={40}
              radius="sm"
              src="https://avatars.githubusercontent.com/u/91818906?s=400&u=6e1018587b8c64e66afb1456061b5638eab86fe0&v=4"
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-md">Complex Notes</p>
              <p className="text-xs md:text-small text-default-500">
                Made by
                <Link
                  className='mx-1 text-xs md:text-small'
                  isExternal
                  showAnchorIcon
                  href="https://github.com/Abubakersiddique761"
                >
                  Abubakersiddique761
                </Link></p>
            </div>
          </CardHeader>
        </Card>
        <div className='lg:columns-2 gap-2 mt-2'>
          {notes.map((note) => (
            <Card key={note.id} className='mb-2'>
              <div className='p-4 flex items-start justify-between space-x-2'>
                <div className='overflow-auto w-full prose prose-invert prose-hr:mt-0 prose-hr:mb-6 prose-img:rounded-xl' dangerouslySetInnerHTML={{ __html: note.htmlContent }}></div>
                <div className='flex items-center justify-center flex-col space-y-2'>
                  <Button color='warning' isIconOnly onClick={() => handleEdit(note.id)}>
                    <Pencil2Icon />
                  </Button>
                  <Button color='danger' isIconOnly onClick={() => handleDelete(note.id)}>
                    <TrashIcon />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {
            notes.length == 0 ?
              <Chip color="danger" variant="flat">No note is created.</Chip>
              :
              <></>
          }
        </div>
        <div className='mt-2'>
          <Textarea
            label="Note"
            placeholder="Write..."
            className="max-w-full"
            description="You can use markdown syntax to make rich edits."
            value={newNote}
            onValueChange={(value) => setNewNote(value)}
            maxRows={25}
          />
        </div>
        <div className='mt-2 flex items-center justify-end space-x-2 pb-8'>
          {
            editingNoteId !== null ?
              <Button color='warning' aria-label="Update" className='ml-2' onClick={handleCreateNote} >
                <LightningBoltIcon /> Update
              </Button>
              :
              <Button color='primary' aria-label="Add" className='ml-2' onClick={handleCreateNote} >
                <PlusIcon /> Create Note
              </Button>
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
