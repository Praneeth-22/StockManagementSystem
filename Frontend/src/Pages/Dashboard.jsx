// src/pages/Dashboard.jsx
import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { 
  PlusCircleOutlined, 
  ShoppingCartOutlined, 
  AuditOutlined, 
  HistoryOutlined 
} from '@ant-design/icons';
import '../App.css'
import { useNavigate } from 'react-router-dom'; // Import the hook

const { Meta } = Card;
const { Title } = Typography;

const Dashboard = () => {
  const navigate = useNavigate(); // Hook to change pages

const cardsData = [
    {
      title: "Add Item",
      icon: <PlusCircleOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      path: '/add-item',
      description: "Add new stock to inventory"
    },
    {
      title: "Make an Order",
      icon: <ShoppingCartOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
      path: '/make-order',
      description: "Create a new customer order"
    },
    {
      title: "Review Order",
      icon: <AuditOutlined style={{ fontSize: '48px', color: '#faad14' }} />,
      path: '/review-order',
      description: "Check pending orders"
    },
    {
      title: "Previous Order",
      icon: <HistoryOutlined style={{ fontSize: '48px', color: '#eb2f96' }} />,
      path: '/previous-orders',
      description: "View order history"
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
          Stock Management Dashboard
        </Title>
        
        {/* Gutter adds spacing between grid items [horizontal, vertical] */}
        <Row gutter={[24, 24]} justify="center">
          {cardsData.map((card, index) => (
            /* Responsive Grid Logic:
               xs={24} -> On Mobile (extra small), take full width (1 card per row)
               sm={12} -> On Tablet (small), take half width (2 cards per row)
               md={6}  -> On Desktop (medium+), take 1/4 width (4 cards in one row)
            */
            <Col xs={24} sm={12} md={6} key={index}>
              <Card
                hoverable
                onClick={() =>navigate(card.path)}
                style={{ height: '100%', textAlign: 'center' }}
                cover={
                  <div style={{ padding: '24px 0' }}>
                    {card.icon}
                  </div>
                }
              >
                <Meta title={card.title} description={card.description} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;