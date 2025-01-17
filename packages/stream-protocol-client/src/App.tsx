

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

function App() {
  return (
    <div>
      <h1>AGW React Demo</h1>
    </div>
  );
}

export default App
