
import { useChat, useCompletion } from 'ai/react';
import Markdown from 'react-markdown';

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

function App() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    streamProtocol: 'data',
    api: 'http://localhost:3001/ai/chat',
  });
  console.log(messages);
  
  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          <Markdown>{message.content}</Markdown>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input name="prompt" value={input} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default App
