const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/codeIDE');

const projectSchema = new mongoose.Schema({
  title: String,
  createdBy: String,
  date: {
    type: Date,
    default: Date.now
  },
  componentCode: {
    type: String,
    default: `
    const MyComponent = () => {
      return (
        <div className="w-80 h-80 bg-red-500 text-white flex items-center justify-center">
          <h1 className="text-4xl font-bold">Hello World</h1>
        </div>
      );
    };

    ReactDOM.render(React.createElement(MyComponent), document.getElementById('root'));`
  }
});

module.exports = mongoose.model("Project", projectSchema);