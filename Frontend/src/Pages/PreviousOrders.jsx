import React, { useState,useEffect } from 'react';
import { Layout, Menu, List, Card, Modal, Button, Typography, Tag, Divider, Descriptions } from 'antd';
import { 
  UnorderedListOutlined,
  HomeOutlined, 
  HistoryOutlined, 
  CalendarOutlined,
  CheckCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { 
  PlusCircleOutlined, 
  ShoppingCartOutlined, 
  AuditOutlined, 
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrders } from '../Redux/OrdersSlice';
const { Header, Content } = Layout;
const { Title, Text } = Typography;

const PreviousOrders = () => {
  const navigate = useNavigate();
     // Navigation Items
  const menuItems = [
    { key: 'home', label: 'Dashboard', icon: <HomeOutlined />, onClick: () => navigate('/') },
    { key: 'list', label: 'Add Item', icon: <PlusCircleOutlined />, onClick: () => navigate('/add-item') },
    { key: 'list', label: 'Make Order', icon: <ShoppingCartOutlined />, onClick: () => navigate('/make-order') },
     { key: 'list', label: 'Review Order', icon: <AuditOutlined />, onClick: () => navigate('/review-order') },
     
  ];
  // 1. Get Orders from Redux (Read Only)
  // We reverse the array to show the latest order first if it isn't already
const orders = useSelector((state) => state.orders.history);
const dispatch = useDispatch();
useEffect(() => {
    dispatch(fetchOrders()); // Fetch fresh data from Cloud
}, [dispatch]);

  // 2. Local State for View Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 3. Handle Click
  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  // 4. Helper to format date nicely
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
       <Header style={{ display: 'flex', alignItems: 'center' ,justifyContent: 'space-between',width: '100%'}}>
             <Menu
               theme="dark"
               mode="horizontal"
               defaultSelectedKeys={['2']}
               items={menuItems}
               style={{ flex: 1, minWidth: 0 }}
             />
       </Header>

      <Content style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <HistoryOutlined style={{ fontSize: '24px', marginRight: '10px', color: '#1890ff' }} />
          <Title level={3} style={{ margin: 0 }}>Past Orders</Title>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#999' }}>
            <p>No history available yet.</p>
          </div>
        ) : (
          <List
            grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}
            dataSource={orders}
            renderItem={(order) => {
              // ✅ LOGIC: Check Status (Default to Pending if undefined)
              const status = order.status || 'Pending';
              const isCompleted = status === 'Completed';

              return (
                <List.Item key={order.id}>
                  <Card 
                    hoverable 
                    onClick={() => showOrderDetails(order)}
                    title={<span style={{ fontSize: '14px' }}>Order #{order.id}</span>}
                    // ✅ CHANGE: Dynamic Tag based on status
                    extra={
                        isCompleted ? 
                        <Tag color="green" icon={<CheckCircleOutlined />}>Completed</Tag> : 
                        <Tag color="orange" icon={<ClockCircleOutlined />}>Pending</Tag>
                    }
                    style={{ borderRadius: '8px' }}
                  >
                    <div style={{ marginBottom: '10px' }}>
                      <CalendarOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {formatDate(order.date)}
                      </Text>
                    </div>
                    <Divider style={{ margin: '12px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong>{order.totalItems} Items</Text>
                      <Button size="small" type="link">View</Button>
                    </div>
                  </Card>
                </List.Item>
              );
            }}
          />
        )}

        <Modal
          title="Order Receipt"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>Close</Button>,
            <Button key="print" type="primary" onClick={() => window.print()}>Print Receipt</Button>
          ]}
          width={500}
        >
          {selectedOrder && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '1px dashed #d9d9d9', paddingBottom: '20px' }}>
                {/* ✅ CHANGE: Dynamic Icon based on status */}
                {selectedOrder.status === 'Completed' ? (
                     <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '10px' }} />
                ) : (
                     <SyncOutlined spin style={{ fontSize: '48px', color: '#faad14', marginBottom: '10px' }} />
                )}
                
                <Title level={4}>
                    {selectedOrder.status === 'Completed' ? "Order Completed" : "Order Pending"}
                </Title>
                <Text type="secondary">ID: {selectedOrder.id}</Text>
                <br />
                <Text type="secondary">{formatDate(selectedOrder.date)}</Text>
              </div>

              <List
                itemLayout="horizontal"
                dataSource={selectedOrder.items}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta title={item.name} description={`Category: ${item.category}`} />
                    <div>x {item.qty}</div>
                  </List.Item>
                )}
              />
              <div style={{ marginTop: '20px', borderTop: '2px solid #f0f0f0', paddingTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
                <Title level={5}>Total Quantity</Title>
                <Title level={5}>{selectedOrder.totalItems}</Title>
              </div>
            </div>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default PreviousOrders;