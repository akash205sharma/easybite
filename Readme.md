EasyBite is a single-restaurant ordering system. The current scope focuses on customer ordering and a lightweight restaurant order-management interface. I intentionally kept the restaurant side limited to order management rather than building a complete restaurant ERP.


The current product scope is one restaurant, but I designed the backend with a restaurant entity and restaurant-linked menu and orders, so extending it to multiple restaurants would mainly require restaurant selection and restaurant-level authorization


orders palced but cart not updated after that
profile
cart context is not dynamic, comming from screens stack
cart empty > brose home > redirecting to login
login refersh should be configured


> restaurant side
menu menagemetn
order status mangaement form restaturant side


## using useFocusEffect instead of useEffect for refreshing

 useEffect(() => {
    loadOrders();
}, []);

useFocusEffect(
    useCallback(() => {
        loadOrders();
    }, [token])
);



1. Role in User model
       ↓
2. JWT includes role
       ↓
3. AdminRequired middleware
       ↓
4. Admin orders API
       ↓
5. Tiny Admin Orders screen
       ↓
6. Customer order status refresh
       ↓
7. Persist cart
       ↓
8. Loading/error/empty states
       ↓
9. Polish UI
       ↓
10. Deploy backend + build APK