import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Card,
  Button,
  Typography,
  Modal,
  Row,
  Col,
  Badge,
  message,

} from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { HomeOutlined, UnorderedListOutlined } from "@ant-design/icons";
import {
  InfoCircleOutlined,
  MinusOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  PlusCircleOutlined,
  ShoppingCartOutlined,
  AuditOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categories } from "../Constants/Categories";
import { submitOrder } from "../Redux/OrdersSlice";
import { fetchItems } from "../Redux/OrdersSlice";
const { Header, Content, Footer } = Layout;
const { Meta } = Card;
const { Title } = Typography;

const MakeOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
  // Navigation Items
  const menuItems = [
    {
      key: "home",
      label: "Dashboard",
      icon: <HomeOutlined />,
      onClick: () => navigate("/"),
    },
    {
      key: "list",
      label: "Add Item",
      icon: <PlusCircleOutlined />,
      onClick: () => navigate("/add-item"),
    },
    {
      key: "list",
      label: "Review Order",
      icon: <AuditOutlined />,
      onClick: () => navigate("/review-order"),
    },
  ];

  // 1. Get all items from Redux
  const allItems = useSelector((state) => state.inventory.items);
useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);
  // 2. Local State for the "Cart" (current selection)
  // Format: { 'itemId_1': 5, 'itemId_2': 1 }
  const [cart, setCart] = useState({});

  // 3. Helper to update quantities
  const updateQuantity = (itemId, change) => {
    setCart((prev) => {
      const currentQty = prev[itemId] || 0;
      const newQty = Math.max(0, currentQty + change); // Prevent negative numbers

      // If quantity is 0, remove key to keep object clean
      if (newQty === 0) {
        const { [itemId]: _, ...rest } = prev; // Remove key
        return rest;
      }
      return { ...prev, [itemId]: newQty };
    });
  };

  // 4. Handle "Save Order"


  const handleSaveOrder = () => {
    const orderItems = Object.entries(cart).map(([itemId, qty]) => {
      const itemDetails = allItems.find((i) => i.id === itemId);
      return { ...itemDetails, qty };
    });

    const newOrder = {
      date: new Date().toISOString(),
      items: orderItems,
      totalItems: orderItems.reduce((acc, item) => acc + item.qty, 0),
    };

    // Use the new Cloud Action
    dispatch(submitOrder(newOrder))
      .unwrap() // This allows us to check if the API call succeeded or failed
      .then(() => {
        message.success("Order saved to Cloud successfully!");
        setCart({}); // Clear the cart
        navigate("/review-order"); // Send user to history page
      })
      .catch((err) => {
        message.error("Failed to save order: " + err.message);
      });
  };

  // 5. Show Description Modal
  const showDescription = (item) => {
    Modal.info({
      title: item.name,
      content: (
        <div>
          <p>
            <strong>Category:</strong> {item.category}
          </p>
          <p>
            <strong>Details:</strong>{" "}
            {item.description || "No description available."}
          </p>
        </div>
      ),
      maskClosable: true,
    });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* <div style={{ color: 'white', fontSize: '18px', marginRight: '30px', fontWeight: 'bold' }}>
               StockApp
             </div> */}
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: "20px", paddingBottom: "80px" }}>
      {allItems.length === 0 && (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '50vh' 
    }}>
      <Spin indicator={antIcon} tip="Connecting to database..." size="large" />
      <div style={{ marginTop: '15px', color: '#8c8c8c' }}>
        Render free servers may take a few seconds to wake up.
      </div>
    </div>
  )}
        {categories.map((category) => {
          // Filter items for this category
          const categoryItems = allItems.filter(
            (item) => item.category === category,
          );

          // Don't show empty categories
          if (categoryItems.length === 0) return null;

          return (
            <div key={category} style={{ marginBottom: "30px" }}>
              <Title
                level={3}
                style={{ borderLeft: "4px solid #1890ff", paddingLeft: "10px" }}
              >
                {category}
              </Title>

              <Row gutter={[16, 16]}>
                {categoryItems.map((item) => {
                  const qty = cart[item.id] || 0;

                  return (
                    <Col xs={24} sm={12} md={12} lg={8} key={item.id}>
                      <Badge count={qty} offset={[-5, 5]}>
                        <Card
                          hoverable
                          style={{
                            width: "100%",
                            borderRadius: "8px",
                            // Subtle border/background change when item is selected
                            border:
                              qty > 0
                                ? "1px solid #1677ff"
                                : "1px solid #f0f0f0",
                            backgroundColor: qty > 0 ? "#f0f5ff" : "#fff",
                            transition: "all 0.3s ease",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                          }}
                          // Compact padding to keep it sleek
                          bodyStyle={{ padding: "16px" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            {/* LEFT SIDE: Item Name */}
                            <div
                              style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                overflow: "hidden",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: "600",
                                  fontSize: "15px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  color: "#1f1f1f",
                                }}
                              >
                                {item.name}
                              </span>
                              {/* Subtle Info Icon next to name */}
                              <InfoCircleOutlined
                                style={{
                                  marginLeft: "8px",
                                  color: "#bfbfbf",
                                  fontSize: "14px",
                                  cursor: "pointer",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showDescription(item);
                                }}
                              />
                            </div>

                            {/* RIGHT SIDE: Controls */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "12px",
                                gap: "8px",
                              }}
                            >
                              <Button
                                shape="circle"
                                size="small"
                                icon={<MinusOutlined />}
                                disabled={qty === 0}
                                onClick={() => updateQuantity(item.id, -1)}
                              />

                              <span
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "15px",
                                  minWidth: "24px",
                                  textAlign: "center",
                                  color: qty > 0 ? "#1677ff" : "#000",
                                }}
                              >
                                {qty}
                              </span>

                              <Button
                                shape="circle"
                                size="small"
                                type={qty > 0 ? "primary" : "default"} // Highlights button when active
                                icon={<PlusOutlined />}
                                onClick={() => updateQuantity(item.id, 1)}
                              />
                            </div>
                          </div>
                        </Card>
                      </Badge>
                    </Col>
                  );
                })}
              </Row>
            </div>
          );
        })}
      </Content>

      {/* Floating Footer Save Button */}
      <Footer
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          padding: "10px 20px",
          background: "#fff",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <Button
          type="primary"
          icon={<SaveOutlined />}
          size="large"
          onClick={handleSaveOrder}
          style={{
            width: "100%",
            maxWidth: "400px",
            height: "50px",
            fontSize: "18px",
          }}
        >
          Save Order ({Object.values(cart).reduce((a, b) => a + b, 0)} Items)
        </Button>
      </Footer>
    </Layout>
  );
};

export default MakeOrder;
