"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ChangeEvent, useState} from "react";
import {ref, uploadBytes} from "firebase/storage";
import {storage, db} from "@/lib/firebase/config";
import {collection, doc} from "firebase/firestore";
import {useSetAtom} from "jotai";
import {dogDraftAtom} from "@/atoms/dogDraftAtom";
import {Loader2} from "lucide-react";
import {analizeDog} from "@/lib/firebase/functions";

export default function ImageUpload() {
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setLoading] = useState(false);
  const setDog = useSetAtom(dogDraftAtom);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleContinue = async () => {
    if (!image || !image.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    setLoading(true);
    const dogRef = doc(collection(db, "dogs"));
    const filePath = `dogs/${dogRef.id}`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, image);
    const result = await analizeDog(filePath)
      .then((result) => {
        if (!result.data.isDog) {
          alert("The image does not contain a dog. Please try again.");
          return;
        }
        return result.data;
      })
      .catch((error) => {
        console.error("Error analyzing image", error);
        alert("An error occurred. Please try again.");
      });
    if (result) {
      setDog({
        id: dogRef.id,
        filePath,
        ...result,
      });
    }
    setLoading(false);
  };

  const previewUrl = image
    ? URL.createObjectURL(image)
    : "https://cdn-icons-png.freepik.com/512/4823/4823463.png";

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Your Dog's Image</CardTitle>
        <CardDescription>
          We will analyze your dog's image before proceeding.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40 rounded-full overflow-hidden">
            <img
              src={previewUrl}
              alt="Image preview"
              width={200}
              height={200}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="image">Select Image</Label>
          <Input
            className="cursor-pointer"
            id="image"
            type="file"
            onChange={handleImageChange}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          disabled={isLoading}
          className="ml-auto"
          onClick={handleContinue}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            <>Continue</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
