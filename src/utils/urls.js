const agentJoinUrl = ({ partnerId, partnerUserId, loginKey }) => {
    return `https://www.glance.net/agentjoin/AgentJoin.aspx?partnerid=${partnerId}&partneruserid=${partnerUserId}&loginkey=${loginKey}`
}

const glanceClient = ({ partnerId, partnerUserId, loginKey }) => {
    return `glancepanorama://authenticate?partnerid=${partnerId}&partneruserid=${partnerUserId}&loginkey=${loginKey}`
}

module.exports = {
    agentJoinUrl,
    glanceClient
}