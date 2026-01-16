// Ceramic Network utilities
export {
  getCeramicClient,
  getComposeClient,
  authenticateWithCeramic,
  authenticateWithSeed,
  isAuthenticated,
  getCurrentDID,
} from "./client";

// Video operations
export {
  createVideo,
  getVideo,
  getVideos,
  updateVideoStats,
  getVideosByCreator,
  type CreateVideoInput,
} from "./videos";

// Creator operations
export {
  createOrUpdateCreator,
  getCreatorByDID,
  getCreatorByHandle,
  searchCreators,
  updateCreatorStats,
  type CreateCreatorInput,
} from "./creators";
