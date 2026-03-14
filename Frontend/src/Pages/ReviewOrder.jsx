import React, { useState } from 'react';
import { Layout, Menu, List, Card, Modal, Button, Typography, Tag, Space, message, Popconfirm, Tooltip, Input, Drawer } from 'antd';
import { 
  HomeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SaveOutlined,
  MinusCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined ,MenuOutlined, HighlightOutlined
} from '@ant-design/icons';
import { 
  PlusCircleOutlined, 
  ShoppingCartOutlined, 
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateOrder, deleteOrder } from '../Redux/OrdersSlice';
import '../App.css'

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input; // ✅ Destructure TextArea

const ReviewOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

const toggleDrawer = () => setIsDrawerVisible(!isDrawerVisible);
  const menuItems = [
    { key: 'home', label: 'Dashboard', icon: <HomeOutlined />, onClick: () => navigate('/') },
    { key: 'list', label: 'Add Item', icon: <PlusCircleOutlined />, onClick: () => navigate('/add-item') },
    { key: 'list', label: 'Make Order', icon: <ShoppingCartOutlined />, onClick: () => navigate('/make-order') },
    
    {}
  ];

  const allOrders = useSelector((state) => state.orders.history);
  const pendingOrders = allOrders.filter(order => order.status !== 'Completed');

  // --- Local State ---
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItems, setEditingItems] = useState([]);
  
  // ✅ NEW: State for Remark
  const [remark, setRemark] = useState(''); 

  // --- Handlers ---

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setEditingItems(JSON.parse(JSON.stringify(order.items))); 
    setRemark(order.remark || ''); // ✅ Load existing remark or empty string
    setIsEditing(false); 
    setIsModalVisible(true);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset if cancelling
    if (isEditing) {
       setEditingItems(JSON.parse(JSON.stringify(selectedOrder.items)));
       setRemark(selectedOrder.remark || ''); // ✅ Reset remark
    }
  };

  const updateItemQty = (itemId, change) => {
    setEditingItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId) {
          const newQty = Math.max(0, item.qty + change);
          return { ...item, qty: newQty };
        }
        return item;
      }).filter(item => item.qty > 0); 
    });
  };

  const handleSaveChanges = () => {
    if (editingItems.length === 0) {
      message.error("Order cannot be empty. Delete the order instead.");
      return;
    }
    const newTotal = editingItems.reduce((acc, item) => acc + item.qty, 0);

    const updatedData = {
        ...selectedOrder, 
        items: editingItems, 
        totalItems: newTotal, 
        status: selectedOrder.status || 'Pending',
        remark: remark // ✅ Save the Remark
    };

    dispatch(updateOrder({
      id: selectedOrder.id, 
      updatedOrder: updatedData 
    })).unwrap()
    .then(() => {
        message.success("Order updated successfully!");
        setIsModalVisible(false);
    })
    .catch((err) => message.error("Update failed: " + err.message));
  };

  const handleDeleteOrder = () => {
    dispatch(deleteOrder(selectedOrder.id)); 
    message.success("Order deleted.");
    setIsModalVisible(false);
  };

  const handleMarkCompleted = (e, order) => {
    e.stopPropagation(); 
    const updatedData = { ...order, status: 'Completed' };

    dispatch(updateOrder({
        id: order.id,
        updatedOrder: updatedData
    })).unwrap()
    .then(() => message.success("Order marked as Completed!"))
    .catch(() => message.error("Failed to update status"));
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
       <Header style={{ 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'space-between', 
  width: '100%', 
  padding: '0 20px' 
}}>
  <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
    StockApp
  </div>

  {/* --- Desktop Menu: Hidden on mobile via CSS --- */}
  <Menu 
    theme="dark" 
    mode="horizontal" 
    defaultSelectedKeys={['2']} 
    items={menuItems} 
    style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end' }} 
    className="hide-on-mobile"
  />

  {/* --- Mobile Button: Shown only on mobile via CSS --- */}
  <Button
    className="show-on-mobile"
    type="text"
    icon={<MenuOutlined style={{ color: 'white', fontSize: '22px' }} />}
    onClick={toggleDrawer}
  />

  {/* --- Mobile Drawer (Sidebar) --- */}
  <Drawer
    title="Navigation"
    placement="right"
    onClose={toggleDrawer}
    open={isDrawerVisible}
    styles={{ body: { padding: 0 } }}
    width={250}
  >
    <Menu
      mode="vertical"
      defaultSelectedKeys={['2']}
      items={menuItems}
      onClick={toggleDrawer} // Closes drawer when a user clicks a link
    />
  </Drawer>
</Header>

      <Content style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <Title level={3}>Pending Orders</Title>
        
        {pendingOrders.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#999' }}>
            <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
            <p>All caught up! No pending orders.</p>
          </div>
        ) : (
          <List
            grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} 
            dataSource={pendingOrders}
            renderItem={(order) => (
              <List.Item>
                <Card 
                  hoverable 
                  onClick={() => handleOrderClick(order)}
                  title={
                    <Space>
                        {`Order #${order.id ? order.id.substring(order.id.length - 4) : '...'}`}
                        <Tag color="orange">Pending</Tag>
                    </Space>
                  } 
                  extra={<Text type="secondary">{new Date(order.date).toLocaleDateString()}</Text>}
                  actions={[
                    <Tooltip title="View Details"><EyeOutlined key="view" /></Tooltip>,
                    <Tooltip title="Mark as Completed">
                        <Button type="text" size="small" style={{ color: '#1890ff' }} icon={<CheckCircleOutlined />} onClick={(e) => handleMarkCompleted(e, order)}>Complete</Button>
                    </Tooltip>
                  ]}
                >
                  <List.Item.Meta
                    description={
                      <div>
                        {/* ✅ Show a small icon if remarks exist */}
                        {order.remark && (
                            <div style={{ marginBottom: '8px', fontSize: '12px', color: '#8c8c8c' }}>
                                <FileTextOutlined /> Has Remarks
                            </div>
                        )}
                        {order.items.slice(0, 3).map(i => (
                          <Tag key={i.id}>{i.qty}x {i.name}</Tag>
                        ))}
                        {order.items.length > 3 && <Tag>+{order.items.length - 3} more</Tag>}
                      </div>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        )}

        {/* --- View / Edit Modal --- */}
        <Modal
          title="Order Details"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={
            isEditing ? (
              <>
                <Button onClick={handleEditToggle}>Cancel</Button>
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveChanges}>Save Changes</Button>
              </>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Space>
                        <Button icon={<EditOutlined />} onClick={handleEditToggle}>Edit</Button>
                        <Popconfirm title="Delete this order?" onConfirm={handleDeleteOrder}>
                            <Button danger icon={<DeleteOutlined />}>Delete</Button>
                        </Popconfirm>
                    </Space>
                    <Button type="primary" onClick={() => setIsModalVisible(false)}>Close</Button>
                </div>
            )
          }
        >
          {selectedOrder && (
            <>
                {/* ✅ SECTION: Remarks Input / Display */}
                <div style={{ marginBottom: '20px' }}>
                    {isEditing ? (
                        <>
                            <Text strong>Remarks:</Text>
                            <TextArea 
                                rows={3} 
                                placeholder="Add note here (e.g. 'Urgent', 'Missing few items')..." 
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                style={{ marginTop: '5px' }}
                            />
                        </>
                    ) : (
                        remark && (
                            <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '6px', borderLeft: '4px solid #1890ff' }}>
                                <Text type="secondary" style={{ fontSize: '12px' }}>REMARKS:</Text><br/>
                                <Text>{remark}</Text>
                            </div>
                        )
                    )}
                </div>

                <List
                itemLayout="horizontal"
                dataSource={isEditing ? editingItems : selectedOrder.items}
                renderItem={(item) => (
                    <List.Item
                    actions={isEditing ? [
                        <Button shape="circle" icon={<MinusCircleOutlined />} danger onClick={() => updateItemQty(item.id, -1)} />,
                        <Text strong style={{ width: '20px', textAlign: 'center' }}>{item.qty}</Text>,
                        <Button shape="circle" icon={<PlusCircleOutlined />} type="primary" onClick={() => updateItemQty(item.id, 1)} />
                    ] : [
                        <Text strong>Qty: {item.qty}</Text>
                    ]}
                    >
                    <List.Item.Meta title={item.name} description={`Category: ${item.category}`} />
                    </List.Item>
                )}
                />
            </>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default ReviewOrder;