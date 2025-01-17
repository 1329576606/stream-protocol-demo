
import { useCompletion } from 'ai/react';

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

function App() {
  const { completion, input, handleInputChange, handleSubmit } = useCompletion({
    streamProtocol: 'text',
    api: 'http://localhost:3808/chat',
  });
  return (
    <form onSubmit={handleSubmit}>
      <input name="prompt" value={input} onChange={handleInputChange} />
      <button type="submit">Submit</button>
      <div>{completion}</div>
    </form>
  );
}

export default App
