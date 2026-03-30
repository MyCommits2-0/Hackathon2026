const Message = ({ type = "success", text }) => {
  return (
    <div className={`alert alert-${type} mt-3`}>
      {text}
    </div>
  );
};

export default Message;