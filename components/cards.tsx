"use client";

import React, {useEffect, useMemo, useRef, useState} from "react";
import TinderCard from "react-tinder-card";
import {
  dislikeDog,
  Dog,
  getDogs,
  likeDog,
  undoDogAction,
} from "@/lib/firebase/firestore";
import useUserSession from "@/hooks/useUserSession";
import {useAtomValue} from "jotai";
import {dogAtom} from "@/atoms/dogAtom";
import {getImageUrl} from "@/lib/utils";

import {Card, CardContent} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {matchDogs} from "@/lib/firebase/functions";
import {Loader2} from "lucide-react";

const Cards = ({session}: {session: string}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState("");
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [chatId, setChatId] = useState("");
  const [lastSwipedId, setLastSwipedId] = useState("");
  const currentIndexRef = useRef(currentIndex);
  const currentDog = useAtomValue(dogAtom);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isLoading, setLoading] = useState(true);
  const userSessionId = useUserSession(session);

  useEffect(() => {
    if (!currentDog.id) return;
    getDogs(userSessionId, currentDog.seen).then((data) => {
      if (data) {
        setDogs(data);
        setCurrentIndex(data.length - 1);
      }
      setLoading(false);
    });
  }, [currentDog]);

  const childRefs: any[] = useMemo(
    () =>
      Array(dogs.length)
        .fill(0)
        .map((i) => React.createRef()),
    [dogs]
  );

  if (!userSessionId || !currentDog.id) return null;

  const updateCurrentIndex = (val: any) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack =
    currentIndex < dogs.length - 1 && !matchedDog && lastSwipedId;

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = async (direction: string, swipedDog: Dog, index: number) => {
    console.log("swiped", direction, swipedDog.id);
    if (direction === "right") {
      debugger;
      const isMatch = swipedDog.likes.includes(currentDog.id!);
      if (isMatch) {
        setMatchLoading(true);
        setMatchedDog(swipedDog);
        setIsDialogOpen(true);
      }
      likeDog(swipedDog.id, currentDog.id!).then(() => {
        if (isMatch) {
          matchDogs(swipedDog.id, currentDog.id!)
            .then((result) => {
              if (result.data.success) {
                setChatId(result.data.chatId);
              } else {
                // show error
              }
            })
            .catch((error) => {
              console.error("Error matching dogs", error);
              // show error
            })
            .finally(() => {
              setMatchLoading(false);
            });
        }
      });
    } else if (direction === "left") {
      dislikeDog(swipedDog.id, currentDog.id!);
      setMatchedDog(null);
    }
    setLastSwipedId(swipedDog.id);
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name: string, idx: number) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current?.restoreCard();
  };

  const swipe = async (dir: string) => {
    if (canSwipe && currentIndex < dogs.length) {
      await childRefs[currentIndex].current?.swipe(dir); // Swipe the card!
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current?.restoreCard();
    await undoDogAction(lastSwipedId, currentDog.id!);
    setLastSwipedId("");
  };

  return (
    <div className="flex justify-center items-center flex-col h-[calc(100vh-4rem)]">
      <div className="dogCard">
        {isLoading && (
          <div className="animate-pulse">
            <Card className="w-80">
              <CardContent className="flex flex-col items-center justify-center h-full">
                <Skeleton className="h-40 w-full rounded-t-md" />
                <div className="space-y-4 p-4">
                  <Skeleton className="h-4 w-[270px]" />
                  <Skeleton className="h-4 w-[270px]" />
                  <Skeleton className="h-4 w-[270px]" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {!isLoading && (!dogs.length || !canSwipe) && (
          <div>
            <Card className="w-80">
              <CardContent className="flex flex-col items-center justify-center h-full">
                <img
                  src="https://generated.vusercontent.net/placeholder.svg"
                  alt="No dogs"
                  className="w-full h-40 object-cover"
                />
                <div className="space-y-4 p-4">
                  <h3 className="text-xl font-bold">No new dogs to meet</h3>
                  <p className="text-muted-foreground">
                    Please try again soon 🐶
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {dogs.map((dog, index) => (
          <TinderCard
            ref={childRefs[index]}
            key={index}
            onSwipe={(dir) => swiped(dir, dog, index)}
            onCardLeftScreen={() => outOfFrame(dog.id, index)}
            className="swipe"
            preventSwipe={["up", "down"]}
          >
            <div className="w-80 rounded-md overflow-hidden shadow-lg">
              <Card className="h-[480px]">
                <CardContent className="flex flex-col items-center justify-center h-full">
                  <img
                    src={getImageUrl(dog.id)}
                    alt={dog.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="space-y-4 p-4">
                    <h3 className="text-xl font-bold">{dog.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {dog.breed}, {dog.age} {dog.ageUnit} old
                    </p>
                    <p className="text-muted-foreground">{dog.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 mt-4">
        <Button
          disabled={!canSwipe}
          onClick={() => swipe("left")}
          variant="ghost"
          size="icon"
        >
          <ThumbsDownIcon className="w-6 h-6" />
          <span className="sr-only">Dislike</span>
        </Button>
        <Button
          disabled={!canGoBack}
          onClick={() => goBack()}
          variant="ghost"
          size="icon"
        >
          <UndoIcon className="w-6 h-6" />
          <span className="sr-only">Undo</span>
        </Button>
        <Button
          disabled={!canSwipe}
          onClick={() => swipe("right")}
          variant="ghost"
          size="icon"
        >
          <ThumbsUpIcon className="w-6 h-6" />
          <span className="sr-only">Like</span>
        </Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center mb-1">
              You&apos;re the perfect match! 🐶 🦴
            </DialogTitle>
            <DialogDescription className="text-center">
              {currentDog.name} and {matchedDog?.name} have liked each other,
              time to engage in a chat!
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 py-6">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40 rounded-full overflow-hidden">
                  <img
                    src={getImageUrl(currentDog.id)}
                    alt="Current Dog image"
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium">{currentDog.name}</div>
                <div className="text-muted-foreground text-sm">
                  {currentDog.breed}, {currentDog.age} {currentDog.ageUnit} old
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40 rounded-full overflow-hidden">
                  <img
                    src={getImageUrl(matchedDog?.id)}
                    alt="Matched Dog image"
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium">{matchedDog?.name}</div>
                <div className="text-muted-foreground text-sm">
                  {matchedDog?.breed}, {matchedDog?.age} {matchedDog?.ageUnit}{" "}
                  old
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex items-center justify-evenly">
            <DialogClose>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button disabled={matchLoading} type="button">
              {matchLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>Go to chat</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function ThumbsDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  );
}

function ThumbsUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

function UndoIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  );
}

export default Cards;
