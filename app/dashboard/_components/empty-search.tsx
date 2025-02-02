import Image from "next/image"
import { ProjectSettings } from "./project-settings"

export const EmptySearch = () => {
    return (
        <div className="w-full h-full md-overflow-y-auto">
            <div className='flex justify-end align-middle'>
                <ProjectSettings />
            </div>
            <div className="h-full flex flex-col items-center justify-center">
                <Image src="/empty-search.svg" height={400} width={400} alt="Empty" />
                <h2 className="text-2xl font-semibold mt-6">
                    No results found!
                </h2>
                <p className="text-muted-foreground text-sm mt-2">
                    Try searching for something else
                </p>
            </div>
        </div>

    )
}