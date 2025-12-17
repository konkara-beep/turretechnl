'use client';
import React, { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('customizer');
  
  // CUSTOMIZER STATE
  const [levels, setLevels] = useState([
    { id: 1, name: 'Base', blocks: [{ id: 'base-1', size: 'Base', color: '#1A1A1A', colorName: 'Black' }] },
    { id: 2, name: 'Level 2', blocks: [{ id: 'l2-1', size: '2x4', color: '#007A53', colorName: 'Green' }, { id: 'l2-2', size: '2x4', color: '#007A53', colorName: 'Green' }] },
    { id: 3, name: 'Level 3', blocks: [{ id: 'l3-1', size: '2x4', color: '#E60012', colorName: 'Red' }] },
    { id: 4, name: 'Level 4', blocks: [{ id: 'l4-1', size: '2x2', color: '#FFFFFF', colorName: 'White' }] },
  ]);
  const [selectedBlock, setSelectedBlock] = useState('base-1');

  // MARKETPLACE STATE
  const [listings, setListings] = useState([]);
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [formData, setFormData] = useState({
    creatorName: '',
    email: '',
    description: '',
    price: '',
    tower: {
      level1: { id: 'l1', size: 'Base', color: '#1A1A1A', colorName: 'Black' },
      level2: [{ id: 'l2-1', size: '2x4', color: '#E60012', colorName: 'Red' }],
      level3: { id: 'l3', size: '2x4', color: '#E60012', colorName: 'Red' },
      level4: { id: 'l4', size: '2x2', color: '#FFFFFF', colorName: 'White' },
    },
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const COLORS = [
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#1A1A1A' },
    { name: 'Red', hex: '#E60012' },
    { name: 'Blue', hex: '#0055BF' },
    { name: 'Grey', hex: '#CCCCCC' },
    { name: 'Yellow', hex: '#F2CD2E' },
    { name: 'Green', hex: '#007A53' },
  ];

  const SIZE_DIMS = {
    '2x2': { w: 80, h: 80 },
    '2x4': { w: 120, h: 80 },
    'Base': { w: 180, h: 40 },
  };

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

  const changeColor = (hex: string, name: string) => {
    setLevels(levels.map(level => ({
      ...level,
      blocks: level.blocks.map(block =>
        block.id === selectedBlock ? { ...block, color: hex, colorName: name } : block
      )
    })));
  };

  const addBlockToLevel = (levelId: number) => {
    const level = levels.find(l => l.id === levelId);
    const levelIndex = levels.findIndex(l => l.id === levelId);
    let maxBlocksForLevel = 1;
    if (levelIndex === 1) maxBlocksForLevel = 2;
    if (level.blocks.length >= maxBlocksForLevel) {
      alert('Cannot add more blocks to this level');
      return;
    }
    setLevels(levels.map(l => {
      if (l.id === levelId) {
        const newBlockId = 'block-' + Date.now();
        return {
          ...l,
          blocks: [...l.blocks, { id: newBlockId, size: '2x4', color: '#E60012', colorName: 'Red' }]
        };
      }
      return l;
    }));
  };

  const addNewLevel = () => {
    if (levels.length >= 6) {
      alert('Maximum 6 levels allowed');
      return;
    }
    const newLevelId = Math.max(...levels.map(l => l.id)) + 1;
    const newLevel = {
      id: newLevelId,
      name: 'Level ' + (levels.length + 1),
      blocks: [{ id: 'block-' + Date.now(), size: '2x4', color: '#E60012', colorName: 'Red' }]
    };
    setLevels([...levels, newLevel]);
  };

  const removeBlock = (blockId) => {
    const totalBlocks = levels.reduce((sum, level) => sum + level.blocks.length, 0);
    if (totalBlocks <= 1) {
      alert('You must keep at least one block!');
      return;
    }
    setLevels(levels.map(level => ({
      ...level,
      blocks: level.blocks.filter(b => b.id !== blockId)
    })).filter(level => level.blocks.length > 0));
  };

  // MARKETPLACE FUNCTIONS
  const addBlockToLevel2 = () => {
    if (formData.tower.level2.length >= 2) {
      alert('Level 2 can have maximum 2 blocks');
      return;
    }
    setFormData({
      ...formData,
      tower: {
        ...formData.tower,
        level2: [...formData.tower.level2, { id: 'l2-' + Date.now(), size: '2x4', color: '#E60012', colorName: 'Red' }],
      },
    });
  };

  const removeBlockFromLevel2 = (id) => {
    if (formData.tower.level2.length <= 1) {
      alert('Level 2 must have at least 1 block');
      return;
    }
    setFormData({
      ...formData,
      tower: {
        ...formData.tower,
        level2: formData.tower.level2.filter(b => b.id !== id),
      },
    });
  };

  const updateLevel2Block = (id, field, value) => {
    setFormData({
      ...formData,
      tower: {
        ...formData.tower,
        level2: formData.tower.level2.map(b => b.id === id ? { ...b, [field]: value } : b),
      },
    });
  };

  const removeLevel = (levelNumber) => {
    const activeLevels = [formData.tower.level1, formData.tower.level2, formData.tower.level3, formData.tower.level4].filter(l => l !== null && l !== undefined);
    if (activeLevels.length <= 1) {
      alert('You must have at least 1 level');
      return;
    }
    if (levelNumber === 1) {
      setFormData({ ...formData, tower: { ...formData.tower, level1: null } });
    } else if (levelNumber === 3) {
      setFormData({ ...formData, tower: { ...formData.tower, level3: null } });
    } else if (levelNumber === 4) {
      setFormData({ ...formData, tower: { ...formData.tower, level4: null } });
    }
  };

  const addBackLevel = (levelNumber) => {
    if (levelNumber === 1) {
      setFormData({ ...formData, tower: { ...formData.tower, level1: { id: 'l1', size: 'Base', color: '#1A1A1A', colorName: 'Black' } } });
    } else if (levelNumber === 3) {
      setFormData({ ...formData, tower: { ...formData.tower, level3: { id: 'l3', size: '2x4', color: '#E60012', colorName: 'Red' } } });
    } else if (levelNumber === 4) {
      setFormData({ ...formData, tower: { ...formData.tower, level4: { id: 'l4', size: '2x2', color: '#FFFFFF', colorName: 'White' } } });
    }
  };

  const updateSingleLevelBlock = (level, field, value) => {
    setFormData({ ...formData, tower: { ...formData.tower, [level]: { ...formData.tower[level], [field]: value } } });
  };

  const handlePublish = () => {
    if (!formData.creatorName.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!formData.email.trim()) {
      alert('Please enter your email');
      return;
    }
    if (!formData.price || formData.price === '') {
      alert('Please enter a price');
      return;
    }

    const newListing = {
      id: Date.now(),
      creatorName: formData.creatorName,
      email: formData.email,
      tower: JSON.parse(JSON.stringify(formData.tower)),
      description: formData.description,
      price: parseFloat(formData.price),
      publishedDate: new Date().toISOString().split('T')[0],
    };

    setListings(prevListings => [newListing, ...prevListings]);
    setFormData({
      creatorName: '',
      email: '',
      description: '',
      price: '',
      tower: {
        level1: { id: 'l1', size: 'Base', color: '#1A1A1A', colorName: 'Black' },
        level2: [{ id: 'l2-1', size: '2x4', color: '#E60012', colorName: 'Red' }],
        level3: { id: 'l3', size: '2x4', color: '#E60012', colorName: 'Red' },
        level4: { id: 'l4', size: '2x2', color: '#FFFFFF', colorName: 'White' },
      },
    });
    setShowPublishForm(false);
    alert('Design published successfully!');
  };

  let filteredListings = listings.filter(l =>
    l.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortBy === 'newest') {
    filteredListings.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
  } else if (sortBy === 'cheapest') {
    filteredListings.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'expensive') {
    filteredListings.sort((a, b) => b.price - a.price);
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: 'white', borderBottom: '2px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: 0 }}>
          <button onClick={() => setActiveTab('customizer')} style={{ padding: '16px 24px', border: 'none', backgroundColor: activeTab === 'customizer' ? '#ffffff' : 'transparent', borderBottomWidth: activeTab === 'customizer' ? '3px' : '0px', borderBottomStyle: 'solid', borderBottomColor: '#3b82f6', cursor: 'pointer', fontWeight: activeTab === 'customizer' ? '600' : '500', color: activeTab === 'customizer' ? '#1f2937' : '#6b7280', fontSize: '16px' }}>
            🧱 TurreTech Customizer
          </button>
          <button onClick={() => setActiveTab('marketplace')} style={{ padding: '16px 24px', border: 'none', backgroundColor: activeTab === 'marketplace' ? '#ffffff' : 'transparent', borderBottomWidth: activeTab === 'marketplace' ? '3px' : '0px', borderBottomStyle: 'solid', borderBottomColor: '#3b82f6', cursor: 'pointer', fontWeight: activeTab === 'marketplace' ? '600' : '500', color: activeTab === 'marketplace' ? '#1f2937' : '#6b7280', fontSize: '16px' }}>
            🏪 BLOKO Marketplace
          </button>
        </div>
      </div>

      <div>
        {activeTab === 'customizer' && (
          <div style={{ backgroundColor: '#f3f4f6', padding: '24px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '4px' }}>🧱 TurreTech</h1>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>You design, we deliver</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', minHeight: 'calc(100vh - 200px)' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    {[...levels].reverse().map(level => (
                      <div key={level.id} style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', justifyContent: 'center' }}>
                        {level.blocks.map(block => {
                          const dims = SIZE_DIMS[block.size];
                          const isSelected = block.id === selectedBlock;
                          return (
                            <div key={block.id} onClick={() => setSelectedBlock(block.id)} style={{ width: dims.w + 'px', height: dims.h + 'px', backgroundColor: block.color, borderWidth: isSelected ? '3px' : '2px', borderStyle: 'solid', borderColor: isSelected ? '#2563eb' : '#d1d5db', borderRadius: '4px', cursor: 'pointer' }} />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{levels.length} levels</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', border: '1px solid #e5e7eb' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>📋 Levels</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                      {levels.map((level, idx) => (
                        <div key={level.id} style={{ backgroundColor: '#f9fafb', borderRadius: '6px', padding: '10px', border: '1px solid #e5e7eb' }}>
                          <p style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '6px', fontSize: '14px' }}>Level {idx + 1}</p>
                          <button onClick={() => addBlockToLevel(level.id)} style={{ width: '100%', padding: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', fontSize: '11px' }}>
                            + Add Block
                          </button>
                        </div>
                      ))}
                    </div>
                    <button onClick={addNewLevel} style={{ width: '100%', marginTop: '12px', padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}>
                      ➕ Add Level ({levels.length}/6)
                    </button>
                  </div>

                  {currentBlock && (
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', border: '1px solid #e5e7eb' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>🎨 Edit Block</h2>
                      {currentBlock.size !== 'Base' && (
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Color</label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                            {COLORS.map(c => (
                              <button key={c.hex} onClick={() => changeColor(c.hex, c.name)} style={{ width: '100%', aspectRatio: '1', backgroundColor: c.hex, borderWidth: currentBlock.color === c.hex ? '3px' : '2px', borderStyle: 'solid', borderColor: currentBlock.color === c.hex ? 'black' : '#999', borderRadius: '4px', cursor: 'pointer' }} title={c.name} />
                            ))}
                          </div>
                        </div>
                      )}
                      {currentBlock.size === 'Base' && (
                        <div style={{ padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '4px', borderWidth: '1px', borderStyle: 'solid', borderColor: '#bbf7d0', color: '#166534', fontWeight: '600', textAlign: 'center', fontSize: '12px' }}>
                          Base is always Black
                        </div>
                      )}
                    </div>
                  )}

                  <button style={{ width: '100%', padding: '12px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
                    📧 Get Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'marketplace' && (
          <div style={{ backgroundColor: '#f3f4f6', padding: '24px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '4px' }}>🏪 BLOKO Marketplace</h1>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Buy and sell custom LEGO tower designs</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'auto auto 1fr', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
                <button onClick={() => setShowPublishForm(!showPublishForm)} style={{ padding: '12px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
                  {showPublishForm ? '✕ Cancel' : '📤 Publish Your Design'}
                </button>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                  <option value="newest">Newest First</option>
                  <option value="cheapest">Cheapest First</option>
                  <option value="expensive">Most Expensive</option>
                </select>
                <input type="text" placeholder="Search by creator name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '100%' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: showPublishForm ? '1fr 1fr' : '1fr', gap: '20px' }}>
                {showPublishForm && (
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', border: '1px solid #e5e7eb', maxHeight: '80vh', overflowY: 'auto' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>Publish Design</h2>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Your Name *</label>
                      <input type="text" value={formData.creatorName} onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })} placeholder="Your name" style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Email *</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Description</label>
                      <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe your tower..." style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', minHeight: '60px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Price (€) *</label>
                      <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }} />
                    </div>
                    <button onClick={handlePublish} style={{ width: '100%', padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}>
                      🚀 Publish
                    </button>
                  </div>
                )}

                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>Designs ({filteredListings.length})</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredListings.length === 0 ? (
                      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', textAlign: 'center', color: '#9ca3af', border: '1px solid #e5e7eb' }}>
                        No designs found
                      </div>
                    ) : (
                      filteredListings.map(listing => (
                        <div key={listing.id} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '16px', border: '1px solid #e5e7eb' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div>
                              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937', marginBottom: '2px' }}>{listing.creatorName}</h3>
                              <p style={{ fontSize: '11px', color: '#6b7280' }}>{listing.publishedDate}</p>
                            </div>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>€{listing.price.toFixed(2)}</p>
                          </div>
                          {listing.description && <p style={{ fontSize: '12px', color: '#4b5563', marginBottom: '8px' }}>{listing.description}</p>}
                          <a href={'mailto:' + listing.email} style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', fontSize: '11px', textDecoration: 'none', display: 'inline-block' }}>
                            ✉️ Contact
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
