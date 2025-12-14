import React, { useState } from 'react';
import { Languages, Copy, Trash2, SwitchCamera } from 'lucide-react';
import chineseConv from 'chinese-conv';

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'traditional' | 'simplified'>('traditional');

  const handleConvert = () => {
    const result = mode === 'traditional' ? chineseConv.tify(inputText) : chineseConv.sify(inputText);
    setOutputText(result);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'traditional' ? 'simplified' : 'traditional');
    setOutputText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3 border-b pb-4">
            <Languages className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">中文简繁转换工具</h1>
          </div>

          {/* Input Section */}
          <div className="space-y-2">
            <label htmlFor="input" className="block text-sm font-medium text-gray-700">
              输入文本
            </label>
            <textarea
              id="input"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (e.target.value === '') setOutputText('');
              }}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={`请输入${mode === 'traditional' ? '简体' : '繁体'}中文...`}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleConvert}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              转换为{mode === 'traditional' ? '繁体' : '简体'}
            </button>
            <button
              onClick={toggleMode}
              className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <SwitchCamera className="w-4 h-4 mr-2" />
              切换模式
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              清空
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="output" className="block text-sm font-medium text-gray-700">
                转换结果
              </label>
              {outputText && (
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-indigo-600 focus:outline-none"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  复制结果
                </button>
              )}
            </div>
            <div className="w-full min-h-32 p-3 bg-gray-50 border border-gray-300 rounded-lg">
              {outputText || (
                <span className="text-gray-400">
                  转换后的{mode === 'traditional' ? '繁体' : '简体'}文字将显示在这里...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;