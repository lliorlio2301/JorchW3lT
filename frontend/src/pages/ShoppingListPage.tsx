import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import shoppingListService from '../services/shoppingListService';
import type { ListItem } from '../types/listItem';
import './ShoppingListPage.css';

const ShoppingListPage: React.FC = () => {
    const { t } = useTranslation();
    const [items, setItems] = useState<ListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('');

    const fetchItems = async () => {
        try {
            const data = await shoppingListService.getAllItems();
            setItems(data);
        } catch (err) {
            console.error('Failed to fetch items:', err);
            setError(t('shopping.error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim()) return;

        try {
            const newItem = await shoppingListService.saveItem({
                name: newItemName,
                quantity: newItemQuantity,
                completed: false
            });
            setItems([...items, newItem]);
            setNewItemName('');
            setNewItemQuantity('');
        } catch (err) {
            console.error('Failed to add item:', err);
        }
    };

    const handleToggle = async (id: number) => {
        try {
            const updated = await shoppingListService.toggleCompleted(id);
            setItems(items.map(item => item.id === id ? updated : item));
        } catch (err) {
            console.error('Failed to toggle item:', err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await shoppingListService.deleteItem(id);
            setItems(items.filter(item => item.id !== id));
        } catch (err) {
            console.error('Failed to delete item:', err);
        }
    };

    if (loading) return <div className="shopping-status">{t('shopping.loading')}</div>;

    return (
        <div className="shopping-container chaos-card">
            <h1>{t('shopping.title')}</h1>
            
            <form className="add-item-form" onSubmit={handleAddItem}>
                <input 
                    type="text" 
                    placeholder={t('shopping.placeholder')} 
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    required
                />
                <input 
                    type="text" 
                    placeholder={t('shopping.quantity')} 
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    className="qty-input"
                />
                <button type="submit">{t('shopping.add')}</button>
            </form>

            {error && <div className="shopping-status error">{error}</div>}

            <div className="shopping-list">
                {items.map((item) => (
                    <div key={item.id} className={`shopping-item ${item.completed ? 'completed' : ''}`}>
                        <div className="item-main" onClick={() => handleToggle(item.id)}>
                            <div className="checkbox">
                                {item.completed && '✓'}
                            </div>
                            <span className="item-name">{item.name}</span>
                            {item.quantity && <span className="item-qty">({item.quantity})</span>}
                        </div>
                        <button className="delete-btn" onClick={() => handleDelete(item.id)}>✕</button>
                    </div>
                ))}
            </div>

            {items.length === 0 && !loading && <p className="no-data">{t('shopping.noData')}</p>}
        </div>
    );
};

export default ShoppingListPage;
