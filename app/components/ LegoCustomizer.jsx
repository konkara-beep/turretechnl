import React, { useState } from 'react';

export default function LegoCustomizer() {
  const [levels, setLevels] = useState([
    { 
      id: 1, 
      name: 'Base',
      blocks: [{ id: 'base-1', size: 'Base', color: '#1A1A1A', colorName: 'Black' }]
    },
    { 
      id: 2, 
      name: 'Level 2',
      blocks: [
        { id: 'l2-1', size: '2×4', color: '#007A53', colorName: 'Green' },
        { id: 'l2-2', size: '2×4', color: '#007A53', colorName: 'Green' }
      ]
    },
    { 
      id: 3, 
      name: 'Level 3',
      blocks: [{ id: 'l3-1', size: '2×4', color: '#E60012', colorName: 'Red' }]
    },
    { 
      id: 4, 
      name: 'Level 4',
      blocks: [{ id: 'l4-1', size: '2×2', color: '#FFFFFF', colorName: 'White' }]
    },
  ]);

  const [selectedBlock, setSelectedBlock] = useState('base-1');

  const COLORS = [
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#1A1A1A' },
    { name: 'Red', hex: '#E60012' },
    { name: 'Blue', hex: '#0055BF' },
    { name: 'Grey', hex: '#CCCCCC' },
    { name: 'Yellow', hex: '#F2CD2E' },
    { name: 'Green', hex: '#007A53' },
  ];

  const SIZES = ['2×2', '2×4', 'Base', 'Cover'];
  const SIZE_DIMS = {
    '2×2': { w: 80, h: 80 },
    '2×4': { w: 120, h: 80 },
    'Base': { w: 180, h: 40 },
    'Cover': { w: 80, h: 80 },
  };

  // Find current selected block
  let currentLevel = null;
  let currentBlock = null;
  for (let level of levels) {
    const block = level.blocks.find(b => b.id === selectedBlock);
    if (block) {
      currentLevel = level;
      currentBlock = block;
      break;
    }
  }

  // Change color
  const changeColor = (hex, name) => {
    setLevels(levels.map(level => ({
      ...level,
      blocks: level.blocks.map(block =>
        block.id === selectedBlock ? { ...block, color: hex, colorName: name } : block
      )
    })));
  };

  // Add block to level - with validation
  const addBlockToLevel = (levelId) => {
    // Check if we can add more blocks to this level
    const level = levels.find(l => l.id === levelId);
    
    // Limit blocks per level based on type
    const levelIndex = levels.findIndex(l => l.id === levelId);
    let maxBlocksForLevel = 1;
    
    if (levelIndex === 0) maxBlocksForLevel = 1; // Base can only have 1
    if (levelIndex === 1) maxBlocksForLevel = 2; // Level 2 can have max 2
    if (levelIndex === 2) maxBlocksForLevel = 1; // Level 3 only 1
    if (levelIndex === 3) maxBlocksForLevel = 1; // Level 4 only 1
    
    if (level.blocks.length >= maxBlocksForLevel) {
      alert(`Level ${levelIndex + 1} can only have ${maxBlocksForLevel} block(s)`);
      return;
    }
    
    setLevels(levels.map(l => {
      if (l.id === levelId) {
        const newBlockId = `block-${Date.now()}`;
        return {
          ...l,
          blocks: [...l.blocks, { id: newBlockId, size: '2×4', color: '#E60012', colorName: 'Red' }]
        };
      }
      return l;
    }));
  };

  // Add new level
  const addNewLevel = () => {
    if (levels.length >= 6) {
      alert('Maximum 6 levels allowed');
      return;
    }
    const newLevelId = Math.max(...levels.map(l => l.id)) + 1;
    const newLevel = {
      id: newLevelId,
      name: `Level ${levels.length + 1}`,
      blocks: [{ id: `block-${Date.now()}`, size: '2×4', color: '#E60012', colorName: 'Red' }]
    };
    setLevels([...levels, newLevel]);
  };

  // Remove block - prevent removing if it's the last one
  const removeBlock = (blockId) => {
    // Count total blocks
    const totalBlocks = levels.reduce((sum, level) => sum + level.blocks.length, 0);
    
    // If only 1 block left, don't remove
    if (totalBlocks <= 1) {
      alert('You must keep at least one block!');
      return;
    }
    
    setLevels(levels.map(level => ({
      ...level,
      blocks: level.blocks.filter(b => b.id !== blockId)
    })).filter(level => level.blocks.length > 0));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>
            TurreTech
          </h1>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>
            You design, we deliver
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
          
          {/* PREVIEW */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', minHeight: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              {[...levels].reverse().map(level => (
                <div key={level.id} style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', justifyContent: 'center' }}>
                  {level.blocks.map(block => {
                    const dims = SIZE_DIMS[block.size];
                    const isSelected = block.id === selectedBlock;
                    return (
                      <div
                        key={block.id}
                        onClick={() => setSelectedBlock(block.id)}
                        style={{
                          width: `${dims.w}px`,
                          height: `${dims.h}px`,
                          backgroundColor: block.color,
                          border: isSelected ? '3px solid #2563eb' : '2px solid #d1d5db',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          transition: 'all 0.2s',
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <p style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                {levels.length} levels
              </p>
            </div>
          </div>

          {/* CONTROLS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* LEVELS & BLOCKS */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>Levels</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '250px', overflowY: 'auto' }}>
                {levels.map((level, idx) => (
                  <div key={level.id} style={{ backgroundColor: '#f9fafb', borderRadius: '6px', padding: '12px', border: '1px solid #e5e7eb' }}>
                    <p style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                      Level {idx + 1} ({level.name})
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      {level.blocks.map((block, blockIdx) => {
                        const totalBlocks = levels.reduce((sum, l) => sum + l.blocks.length, 0);
                        const canRemove = totalBlocks > 1;
                        
                        return (
                          <div
                            key={block.id}
                            onClick={() => setSelectedBlock(block.id)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '4px',
                              backgroundColor: selectedBlock === block.id ? '#dbeafe' : '#e5e7eb',
                              border: selectedBlock === block.id ? '2px solid #2563eb' : '1px solid #9ca3af',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#1f2937',
                            }}
                          >
                            <div style={{ width: '16px', height: '16px', backgroundColor: block.color, borderRadius: '2px', border: '1px solid #666' }} />
                            {block.size}
                            <button
                              onClick={(e) => { 
                                e.stopPropagation();
                                if (canRemove) removeBlock(block.id);
                              }}
                              disabled={!canRemove}
                              style={{ 
                                marginLeft: '4px', 
                                padding: '0 4px', 
                                backgroundColor: canRemove ? '#ef4444' : '#ccc', 
                                color: 'white', 
                                borderRadius: '2px', 
                                border: 'none', 
                                cursor: canRemove ? 'pointer' : 'not-allowed',
                                fontSize: '10px',
                                opacity: canRemove ? 1 : 0.5,
                              }}
                              title={canRemove ? 'Remove block' : 'Cannot remove last block'}
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => addBlockToLevel(level.id)}
                      style={{ width: '100%', padding: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}
                    >
                      + Add Block to Level {idx + 1}
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Add new level button */}
              <button
                onClick={addNewLevel}
                disabled={levels.length >= 6}
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: levels.length >= 6 ? '#ccc' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: levels.length >= 6 ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: levels.length >= 6 ? 0.6 : 1,
                }}
                title={levels.length >= 6 ? 'Maximum 6 levels' : 'Add new level'}
              >
                ➕ Add New Level ({levels.length}/6)
              </button>
            </div>

            {/* EDITOR */}
            {currentBlock && (
              <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
                  Edit Block - {currentBlock.size}
                </h2>

                {/* COLOR - Only show for non-Base blocks */}
                {currentBlock.size !== 'Base' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Color</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {COLORS.map(c => (
                        <button
                          key={c.hex}
                          onClick={() => changeColor(c.hex, c.name)}
                          style={{
                            width: '100%',
                            aspectRatio: '1',
                            backgroundColor: c.hex,
                            border: currentBlock.color === c.hex ? '3px solid black' : '2px solid #999',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Message for Base blocks */}
                {currentBlock.size === 'Base' && (
                  <div style={{ 
                    padding: '12px', 
                    backgroundColor: '#f0fdf4', 
                    borderRadius: '4px', 
                    border: '1px solid #bbf7d0',
                    color: '#166534',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>
                    Base is always Black - No color options
                  </div>
                )}
              </div>
            )}

            {/* SEND DESIGN FOR QUOTE */}
            <button style={{ width: '100%', padding: '16px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
              📧 Send Your Design - Get Our Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
