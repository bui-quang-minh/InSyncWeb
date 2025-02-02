"use client";

import Image from "next/image";
import Link from "next/link";
import { Overlay } from "./overlay";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import { Footer } from "./footer";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal } from "lucide-react";
import { Actions } from "@/components/actions";

interface ScenarioCardProps {
    id: string;
    title: string;
    authorName: string;
    authorId: string;
    createdAt: number; // Assuming createdAt is a timestamp in milliseconds
    imageUrl: string;
    isFavorite: boolean;
    toggleFavorite: () => void;
    deleteScenario: () => void;
    renameScenario: (id: string, newTitle: string) => Promise<void>;
}

export const ScenarioCard = ({
    id,
    title,
    authorName,
    authorId,
    createdAt,
    imageUrl,
    isFavorite,
    toggleFavorite,
    deleteScenario,
    renameScenario
}: ScenarioCardProps) => {
    const { userId } = useAuth();
    const authorLabel = userId === authorId ? "You" : authorName;

    // Convert the createdAt timestamp to a Date object
    const createdAtDate = new Date(createdAt);

    // Get the local timezone offset in minutes and convert to milliseconds
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000; // offset in milliseconds

    // Adjust the createdAt date based on the local timezone
    const adjustedCreatedAtDate = new Date(createdAtDate.getTime() - timezoneOffset);

    // Format the distance from now
    const createdAtLabel = formatDistanceToNow(adjustedCreatedAtDate, { addSuffix: true });

    return (
        <Link href={`/scenario/${id}`}>
            <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
                <div className="relative flex-1 bg-gray-200">
                    <Image src={imageUrl} fill className="object-fit" alt={title} />
                    <Overlay />
                    <Actions
                        id={id}
                        title={title}
                        side="right"
                        deleteScenario={deleteScenario}
                        renameScenario={renameScenario}>
                        <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none">
                            <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity" />
                        </button>
                    </Actions>
                </div>
                <Footer
                    isFavorite={isFavorite}
                    title={title}
                    authorLabel={authorLabel}
                    createdAtLabel={createdAtLabel} // This now reflects the local time adjustment
                    onClick={toggleFavorite}
                    disabled={false}
                />
            </div>
        </Link>
    );
}

ScenarioCard.Skeleton = function ScenarioCardSkeleton() {
    return (
        <div className="aspect-[100/127] rounded-lg overflow-hidden">
            <Skeleton className="h-full w-full" />
        </div>
    );
}
