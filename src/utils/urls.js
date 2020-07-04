const agentJoinUrl = ({ partnerId, partnerUserId, loginKey }) => {
    return `https://www.glance.net/agentjoin/AgentJoin.aspx?partnerid=${partnerId}&partneruserid=${partnerUserId}&loginkey=${loginKey}`
}

const glanceClient = ({ partnerId, partnerUserId, loginKey }) => {
    return `glancepanorama://authenticate?partnerid=${partnerId}&partneruserid=${partnerUserId}&loginkey=${loginKey}`
}

function agentJoinUrls (groups) {
    for (var i = 0; i < groups.length; i++) {
      groups[i].agentJoin = agentJoinUrl(groups[i])
    }
  }

  function glanceClients (groups) {
    for (var i = 0; i < groups.length; i++) {
      groups[i].glanceClient = glanceClient(groups[i])
    }
  }

module.exports = {
    agentJoinUrl,
    glanceClient,
    agentJoinUrls,
    glanceClients
}