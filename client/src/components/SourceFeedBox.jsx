const SourceFeedBox = ({sourceFeed, removeFeed}) => {
  return (
    <div
      className = "box"
      key = {sourceFeed.id}
    >
      <div className = "media">
        <div className = "media-left">
          <figure className = "image is-96x96">
            <img
              src = {sourceFeed.imageUrl}
              alt = {`${sourceFeed.title} main image`}
            />
          </figure>
        </div>
        <div className = "media-content">
          <p className = "title is-5">
            {sourceFeed.title}
          </p>
          <p>
            {sourceFeed.url}
          </p>
        </div>
      </div>
      
      <button
        className = "button is-danger"
        value = {sourceFeed.id}
        onClick = {removeFeed}
      >
        Remove feed
      </button>
    </div>
  );
};

export default SourceFeedBox;