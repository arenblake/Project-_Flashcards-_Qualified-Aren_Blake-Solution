import React from "react";
import { useParams, useHistory } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import { readDeck } from "../utils/api/index";
import { useEffect, useState } from "react";
import Card from "./Card";
import { CreateButton } from "./CreateButton";

export default function Study() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState([]);
  const [card, setCard] = useState({});
  const [cardId, setCardId] = useState(0);
  const [side, setSide] = useState(true);

  const history = useHistory();

  useEffect(() => {
    const abortController = new AbortController();
    async function loadCards() {
      const deck = await readDeck(deckId, abortController.signal);
      setDeck(deck);
      // setCard(deck.cards.find(({ id }) => id === 4));
      setCard(deck.cards[cardId]);
    }
    loadCards();

    return () => abortController.abort();
  }, [deckId]);

  const handleFlip = () => {
    setSide(!side);
  };

  const handleNext = () => {
    console.log(deck.cards);
    if (cardId < deck.cards.length - 1) {
      setSide(!side);
      setCardId((currentId) => currentId + 1);
      setCard(deck.cards[cardId]);
      // setCard(deck.cards.find(({ id }) => id === card.id + 1));
    } else {
      window.confirm(
        "Restart cards?\n\nClick 'cancel' to return to the home page."
      )
        ? restart()
        : history.push("/");
    }
  };

  const restart = () => {
    setSide(!side);
    setCardId(0);
    setCard(deck.cards[0]);
  };

  let content;

  if (deck?.cards?.length > 2) {
    content = (
      <Card
        deck={deck}
        card={card}
        cardId={cardId}
        side={side}
        handleFlip={handleFlip}
        handleNext={handleNext}
      />
    );
  } else {
    content = (
      <>
        <h1>Not enough cards</h1>
        <p>
          You need at least 3 cards to study. There are {deck?.cards?.length}{" "}
          cards in this deck
        </p>
        <CreateButton text="Add Cards" path={`/decks/${deckId}/cards/new`} />
      </>
    );
  }

  if (deck.id) {
    return (
      <>
        <Breadcrumb deckId={deckId} />
        <h1>Study: {deck.name}</h1>
        {/* <Card
          deck={deck}
          card={card}
          cardId={cardId}
          side={side}
          handleFlip={handleFlip}
          handleNext={handleNext}
        /> */}
        {content}
      </>
    );
  }
  return "Loading...";
}
