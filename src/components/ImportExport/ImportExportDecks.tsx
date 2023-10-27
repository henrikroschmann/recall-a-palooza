import React, { useState, ChangeEvent } from 'react';
import { Deck } from 'types';
import { useFetchAllDecksQuery, useCreatePostMutation } from '../../utils/api/DeckApi';


const ImportExportDecks: React.FC = () => {
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const { data: decks } = useFetchAllDecksQuery();
  const [createDeck] = useCreatePostMutation();

  // eslint-disable-next-line @typescript-eslint/require-await
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const content = e.target.result as string;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const deck: Deck = JSON.parse(content);
          await createDeck(deck);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportDeck = () => {
    const deckToExport = decks?.find(deck => deck.id === selectedDeck);
    if (deckToExport) {
      const blob = new Blob([JSON.stringify(deckToExport)], { type: 'application/json' });
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = `deck-${selectedDeck!}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h1>Import and Export Decks</h1>
      <section>
        <h2>Import Deck</h2>
        <input type="file" onChange={() => handleFileChange} />
      </section>

      <section>
        <h2>Export Deck</h2>
        <select value={selectedDeck || ''} onChange={(e) => setSelectedDeck(e.target.value)}>
          <option value="" disabled>Select a deck</option>
          {decks?.map(deck => (
            <option key={deck.id} value={deck.id}>{deck.id}</option>
          ))}
        </select>
        <button onClick={handleExportDeck}>Export Selected Deck</button>
      </section>
    </div>
  );
};

export default ImportExportDecks;
