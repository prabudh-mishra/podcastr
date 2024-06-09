"use client";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import PodcastDetailPlayer from "@/components/PodcastDetailPlayer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import React from "react";

const PodcastDetails = ({
  params: { podcastId },
}: {
  params: { podcastId: Id<"podcasts"> };
}) => {
  const { user } = useUser();

  const podcast = useQuery(api.podcasts.getPodcastById, { podcastId });

  const similiarPodcasts = useQuery(api.podcasts.getPodcastByVoiceType, {
    podcastId,
  });

  const isOwner = user?.id === podcast?.authorId;

  if (!podcast || !similiarPodcasts) {
    return <LoaderSpinner />;
  }

  return (
    <section className="flex flex-col w-full">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">Currently Playing</h1>
        <figure className="flex gap-3">
          <Image
            src="/icons/headphone.svg"
            alt="headphone"
            width={24}
            height={24}
          />
          <h2 className="text-16 font-bold text-white-1">{podcast?.views}</h2>
        </figure>
      </header>

      {/* 
      // @ts-ignore */}
      <PodcastDetailPlayer
        isOwner={isOwner}
        podcastId={podcast._id}
        {...podcast}
      />

      <p className="text-white-2 text-16 pb-8 pt[45px] font-medium max-md:text-center">
        {podcast?.podcastDescription}
      </p>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Transcription</h1>
          <p className="text-16 font-medium text-white-2">
            {podcast?.voicePrompt}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Thumbnail Prompt</h1>
          <p className="text-16 font-medium text-white-2">
            {podcast?.imagePrompt}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5 mt-8">
        <div className="text-20 font-bold text-white-1">Similiar Podcasts</div>

        {similiarPodcasts && similiarPodcasts.length ? (
          <div className="podcast_grid">
            {similiarPodcasts?.map(
              ({ _id, podcastTitle, podcastDescription, imageURL }) => (
                <PodcastCard
                  key={_id}
                  podcastId={_id}
                  title={podcastTitle}
                  imgURL={imageURL!}
                  description={podcastDescription}
                />
              )
            )}
          </div>
        ) : (
          <EmptyState
            title="No Similiar Podcasts found"
            buttonLink="/discover"
            buttonText="Discover more podcasts"
          />
        )}
      </div>
    </section>
  );
};

export default PodcastDetails;