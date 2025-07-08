const ConfirmDeleteModal = ({comb, deleteComb, cancelDeletion}) => {
  return (
    <div className = "modal is-active">
      <div
        className = "modal-background"
        onClick = {cancelDeletion}
      />
      <div className = "modal-content">
        <div className = "box">
          <div className = "media">
            <div className = "media-left">
              <figure className = "image is-96x96">
                <img
                  src = {comb.imageUrl || null}
                  alt = {`${comb.title} cover image`}
                />
              </figure>
            </div>
            <div className = "media-content">
              <p className = "title is-5 mb-2">
                Deleting {comb.title}
              </p>
              <p>
                You are about to delete {comb.title}.
                <br />
                This action cannot be undone, and your pod-catching software will be unable to retrieve data from this feed.
                <br />
                <strong className = "has-text-danger">
                  Are you sure you want to continue?
                </strong>
              </p>
              <p className = "my-2 has-text-centered">
                <button
                  className = "button is-danger mr-3"
                  onClick = {deleteComb}
                >
                  Yes, delete
                </button>
                <button
                  className = "button is-warning ml-2"
                  onClick = {cancelDeletion}
                >
                  No, do not delete
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick = {cancelDeletion}
      />
    </div>
  );
};

export default ConfirmDeleteModal;