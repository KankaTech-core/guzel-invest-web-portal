export const OPEN_CONNECTED_PROJECT_GALLERY_EVENT = "open-connected-project-gallery";

export interface OpenConnectedProjectGalleryDetail {
    key?: string;
}

export const dispatchOpenConnectedProjectGallery = (
    detail: OpenConnectedProjectGalleryDetail = {}
) => {
    if (typeof window === "undefined") {
        return;
    }

    window.dispatchEvent(
        new CustomEvent<OpenConnectedProjectGalleryDetail>(
            OPEN_CONNECTED_PROJECT_GALLERY_EVENT,
            {
                detail,
            }
        )
    );
};
