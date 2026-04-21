const changeTicket = (ticket) => ({
    type: 'CHANGE_TICKET',
    ticket,
});
const changeUserInfo = (userinfo) => ({
    type: 'CHANGE_USERINFO',
    userinfo,
});

export { changeTicket, changeUserInfo };
