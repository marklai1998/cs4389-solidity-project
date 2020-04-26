pragma solidity >=0.5.12;
pragma experimental ABIEncoderV2;


contract EventManager {
    struct Event {
        address payable organizer;
        string id;
        string name;
        string description;
        string startDate;
        string dueDate;
        int256 headcount;
        uint256 fee;
        bool claimed;
    }

    struct Attendee {
        address payable buyer;
        string firstName;
        string lastName;
        string email;
    }

    Event[] private EventLists;
    mapping(string => Attendee[]) EventAttendee;

    function createEvent(
        string memory _id,
        string memory _name,
        string memory _description,
        string memory _startDate,
        string memory _dueDate,
        int256 _headcount,
        uint256 _fee
    ) public payable returns (bool) {
        require(bytes(_id).length != 0, "id should not be empty");
        require(bytes(_name).length != 0, "name should not be empty");
        require(
            bytes(_description).length != 0,
            "description should not be empty"
        );
        require(bytes(_startDate).length != 0, "startDate should not be empty");
        require(bytes(_dueDate).length != 0, "dueDate should not be empty");
        require(_fee >= 0, "fee should not be empty");
        require(_headcount != 0, "headcount should not be empty");

        for (uint256 i = 0; i < EventLists.length; i++) {
            if (keccak256(bytes(EventLists[i].id)) == keccak256(bytes(_id))) {
                return false;
            }
        }

        EventLists.push(
            Event({
                id: _id,
                fee: _fee,
                organizer: msg.sender,
                name: _name,
                description: _description,
                startDate: _startDate,
                dueDate: _dueDate,
                headcount: _headcount,
                claimed: false
            })
        );
        return true;
    }

    function getEventById(string memory _id)
        public
        view
        returns (Event memory)
    {
        for (uint256 i = 0; i < EventLists.length; i++) {
            if (keccak256(bytes(EventLists[i].id)) == keccak256(bytes(_id))) {
                return EventLists[i];
            }
        }
    }

    function getAllEvent() public view returns (Event[] memory) {
        return EventLists;
    }

    function getEventAttendeesById(string memory _id)
        public
        view
        returns (Attendee[] memory)
    {
        return EventAttendee[_id];
    }

    function getEventFeeById(string memory _id) public view returns (uint256) {
        for (uint256 i = 0; i < EventLists.length; i++) {
            if (keccak256(bytes(EventLists[i].id)) == keccak256(bytes(_id))) {
                return EventLists[i].fee;
            }
        }
    }

    function getEventClaimedById(string memory _id) public view returns (bool) {
        for (uint256 i = 0; i < EventLists.length; i++) {
            if (keccak256(bytes(EventLists[i].id)) == keccak256(bytes(_id))) {
                return EventLists[i].claimed;
            }
        }
    }

    function getEventOwnerById(string memory _id)
        public
        view
        returns (address payable)
    {
        for (uint256 i = 0; i < EventLists.length; i++) {
            if (keccak256(bytes(EventLists[i].id)) == keccak256(bytes(_id))) {
                return EventLists[i].organizer;
            }
        }
    }

    function addHeadcount(string memory _id) private returns (bool) {
        for (uint256 i = 0; i < EventLists.length; i++) {
            if (keccak256(bytes(EventLists[i].id)) == keccak256(bytes(_id))) {
                require(!EventLists[i].claimed, "event is locked");
                EventLists[i].headcount += 1;
                return true;
            }
        }
    }

    function subHeadcount(string memory _id) private returns (bool) {
        for (uint256 i = 0; i < EventLists.length; i++) {
            if (keccak256(bytes(EventLists[i].id)) == keccak256(bytes(_id))) {
                require(
                    !EventLists[i].claimed && EventLists[i].headcount > 0,
                    "headcount not enough"
                );
                EventLists[i].headcount -= 1;
                return true;
            }
        }
        return false;
    }

    function joinEvent(
        string memory _eventId,
        string memory _firstName,
        string memory _lastName,
        string memory _email
    ) public payable returns (bool) {
        require(!getEventClaimedById(_eventId), "event is locked");
        require(msg.value == getEventFeeById(_eventId), "fee not enough");
        require(subHeadcount(_eventId), "headcount not enough");
        EventAttendee[_eventId].push(
            Attendee({
                buyer: msg.sender,
                firstName: _firstName,
                lastName: _lastName,
                email: _email
            })
        );
        return true;
    }

    function leaveEvent(string memory _eventId) public payable returns (bool) {
        require(!getEventClaimedById(_eventId), "event is locked");

        for (uint256 i = 0; i < EventAttendee[_eventId].length; i++) {
            if (EventAttendee[_eventId][i].buyer == msg.sender) {
                addHeadcount(_eventId);

                // get user info
                address payable currentAttendee = EventAttendee[_eventId][i]
                    .buyer;
                uint256 amount = getEventFeeById(_eventId);
                // shift the array
                for (
                    uint256 j = i;
                    j < EventAttendee[_eventId].length - 1;
                    j++
                ) {
                    EventAttendee[_eventId][j] = EventAttendee[_eventId][j + 1];
                }
                delete EventAttendee[_eventId][EventAttendee[_eventId].length -
                    1];

                EventAttendee[_eventId].length--;
                //pay user after delete
                currentAttendee.transfer(amount);
                return true;
            }
        }
        return false;
    }

    function setClaimed(string memory _id) private returns (bool) {
        for (uint256 i = 0; i < EventLists.length; i++) {
            if (
                (keccak256(bytes(EventLists[i].id)) == keccak256(bytes(_id))) &&
                !EventLists[i].claimed
            ) {
                EventLists[i].claimed = true;
                return EventLists[i].claimed;
            }
        }
        return false;
    }

    function claimEvent(string memory _eventId) public payable returns (bool) {
        //EventManager EM = EventManager(Eventaddr);
        require(
            getEventOwnerById(_eventId) == msg.sender,
            "you are not the event owner"
        );
        if (setClaimed(_eventId)) {
            uint256 amount = getEventFeeById(_eventId) *
                EventAttendee[_eventId].length;
            address payable owner = getEventOwnerById(_eventId);
            owner.transfer(amount);
            return true;
        }
        return false;
    }
}
