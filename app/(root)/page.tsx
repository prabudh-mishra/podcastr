"use client";
import PodcastCard from "@/components/PodcastCard";
import { podcastData } from "@/constants";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const Home = () => {
  const podcasts = useQuery(api.podcasts.getTrendingPodcasts);

  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>
        <div className="podcast_grid">
          {podcasts?.map(
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
      </section>
    </div>
  );
};

export default Home;
