const BoxMessage = ({message, clear, delay}) => {
  if(delay){
    setTimeout(clear, delay);
  }
  return (
    <div className = {`message mx-3 is-${message?.color || "dark"}`}>
      <div className = "message-header">
        <p>
          {message.title || "Message"}
        </p>
        <button
          class="delete"
          aria-label="delete"
          onClick = {clear}
        />
      </div>
      {message.text ?
        <div className = "message-body">
          {message.text}
        </div>
        : <></>
      }
    </div>
  );
};

export default BoxMessage;