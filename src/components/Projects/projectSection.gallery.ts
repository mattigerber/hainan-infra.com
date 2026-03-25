import type { ListedProject } from "@/data/projectFilterSystem";

import { isCoverFilename, isDirectVideoSource } from "./projectSection.helpers";

export type GalleryItemWithIndex = {
  item: ListedProject["gallery"][number];
  galleryIndex: number;
};

export type ProcessedGalleryItems = {
  selectedVideoEntry: GalleryItemWithIndex | undefined;
  hasSelectedVideo: boolean;
  selectedVideo: ListedProject["gallery"][number] | undefined;
  selectedVideoIndex: number | null;
  primaryNoVideoImageEntry: GalleryItemWithIndex | null;
  selectedVideoCoverImage: string | null;
  galleryPreviewItems: GalleryItemWithIndex[];
  galleryPreviewSlots: Array<GalleryItemWithIndex | null>;
  hiddenPreviewImageCount: number;
};

export const processGalleryItems = (
  gallery: ListedProject["gallery"]
): ProcessedGalleryItems => {
  const galleryWithIndex = gallery.map((item, galleryIndex) => ({
    item,
    galleryIndex,
  }));

  const selectedVideoEntry = galleryWithIndex.find(
    ({ item }) => item.kind === "video" && isDirectVideoSource(item.src)
  );
  const hasSelectedVideo = Boolean(selectedVideoEntry);
  const selectedVideo = selectedVideoEntry?.item ?? gallery[0];
  const selectedVideoIndex = selectedVideoEntry?.galleryIndex ?? null;

  const imageItems = galleryWithIndex.filter(({ item }) => item.kind === "image");
  const coverImageItem = imageItems.find(({ item }) => isCoverFilename(item.src));

  const primaryNoVideoImageEntry =
    !hasSelectedVideo && imageItems.length > 0
      ? (coverImageItem ?? imageItems[0])
      : null;

  const selectedVideoCoverImage = coverImageItem?.item?.src ?? imageItems[0]?.item?.src ?? null;

  const imagePreviewItems = hasSelectedVideo
    ? imageItems.filter(({ item }) => !isCoverFilename(item.src))
    : imageItems.filter(
        ({ galleryIndex }) => galleryIndex !== primaryNoVideoImageEntry?.galleryIndex
      );

  const galleryPreviewItems = imagePreviewItems.slice(0, 4);
  const galleryPreviewSlots = Array.from(
    { length: 4 },
    (_, index) => galleryPreviewItems[index] ?? null
  );

  const hiddenPreviewImageCount = Math.max(
    imagePreviewItems.length - galleryPreviewItems.length,
    0
  );

  return {
    selectedVideoEntry,
    hasSelectedVideo,
    selectedVideo,
    selectedVideoIndex,
    primaryNoVideoImageEntry,
    selectedVideoCoverImage,
    galleryPreviewItems,
    galleryPreviewSlots,
    hiddenPreviewImageCount,
  };
};
