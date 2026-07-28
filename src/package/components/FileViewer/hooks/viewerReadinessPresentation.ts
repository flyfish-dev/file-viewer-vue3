export interface ViewerReadinessPresentationInput {
  loading: boolean;
  progressiveReady: boolean;
  renderedReady: boolean;
  hasError: boolean;
}

export interface ViewerReadinessPresentation {
  contentHidden: boolean;
  loadingStateVisible: boolean;
}

export const resolveViewerReadinessPresentation = ({
  loading,
  progressiveReady,
  renderedReady,
  hasError
}: ViewerReadinessPresentationInput): ViewerReadinessPresentation => {
  // Progressive renderers expose usable content before the outer loading
  // controller finishes. Once the full render is committed, never hide that
  // content again while the final loading flag is draining.
  const loadingStateVisible = (
    loading &&
    !progressiveReady &&
    !renderedReady &&
    !hasError
  )

  return {
    contentHidden: hasError || loadingStateVisible,
    loadingStateVisible
  }
}
