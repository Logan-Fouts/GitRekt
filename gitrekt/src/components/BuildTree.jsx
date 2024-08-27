import React, { useMemo } from 'react';

const TreeBuilder = ({ log }) => {
  const processedLog = useMemo(() => {
    if (!log || log.length === 0) return [];

    const branchMap = new Map();
    let maxColumn = 0;

    return log.map((commit, index) => {
      const branches = commit.refs ? commit.refs.split(', ') : [];
      let column = branchMap.get(commit.hash) || 0;

      branches.forEach(branch => {
        if (!branchMap.has(branch)) {
          maxColumn++;
          branchMap.set(branch, maxColumn);
        }
        column = Math.max(column, branchMap.get(branch));
      });

      if (index < log.length - 1) {
        const nextCommit = log[index + 1];
        branchMap.set(nextCommit.hash, column);
      }

      return { ...commit, column };
    });
  }, [log]);

  if (!log || log.length === 0) {
    return <div className="no-commits">No commit history available.</div>;
  }

  const maxColumn = Math.max(...processedLog.map(commit => commit.column));
  const columnWidth = 30;
  const rowHeight = 100;  // Increased to accommodate branch labels below
  const svgWidth = (maxColumn + 1) * columnWidth + 600;

  return (
    <div className="w-full h-full overflow-auto">
      <svg width={svgWidth} height={processedLog.length * rowHeight}>
        <g className="commit-group">
          {processedLog.map((commit, index) => (
            <React.Fragment key={commit.hash}>
              {/* Draw branch lines */}
              {index < processedLog.length - 1 && (
                <line
                  x1={commit.column * columnWidth + 15}
                  y1={(index * rowHeight) + 50}
                  x2={processedLog[index + 1].column * columnWidth + 15}
                  y2={((index + 1) * rowHeight) + 50}
                  stroke="#4a86e8"
                  strokeWidth="3"
                />
              )}
              {/* Draw commit circle */}
              <circle
                cx={commit.column * columnWidth + 15}
                cy={index * rowHeight + 50}
                r="8"
                fill="#4a86e8"
              />
              {/* Draw commit message */}
              <text
                x={(maxColumn + 1) * columnWidth + 30}
                y={index * rowHeight + 30}
                fill="#ffffff"
                fontSize="14"
                fontFamily="Arial, sans-serif"
              >
                {commit.message}
              </text>
              {/* Draw commit hash */}
              <text
                x={(maxColumn + 1) * columnWidth + 30}
                y={index * rowHeight + 50}
                fill="#b0b0b0"
                fontSize="12"
                fontFamily="monospace"
              >
                {commit.hash.substring(0, 7)}
              </text>
              {/* Draw author name */}
              <text
                x={(maxColumn + 1) * columnWidth + 30}
                y={index * rowHeight + 70}
                fill="#b0b0b0"
                fontSize="12"
                fontFamily="Arial, sans-serif"
              >
                {`Author: ${commit.author_name}`}
              </text>
              {/* Draw branch/tag labels */}
              {commit.refs && (
                <text
                  x={(maxColumn + 1) * columnWidth + 30}
                  y={index * rowHeight + 90}
                  fill="#ffa500"
                  fontSize="12"
                  fontFamily="Arial, sans-serif"
                >
                  {commit.refs}
                </text>
              )}
            </React.Fragment>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default TreeBuilder;