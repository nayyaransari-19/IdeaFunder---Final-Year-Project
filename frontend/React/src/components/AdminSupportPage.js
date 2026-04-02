import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function AdminSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/support/admin-tickets');
      setTickets(response.data.tickets);
    } catch (error) {
      toast.error('Error fetching tickets.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async (ticketId) => {
    setIsLoading(true);
    
    try {
      await axios.post(`http://127.0.0.1:8000/api/support/admin-reply/${ticketId}`, { response });
      toast.success('Reply sent and ticket closed.');
      fetchTickets();
    } catch (error) {
      toast.error('Error replying to ticket.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Admin - Support Tickets</h2>
      {isLoading ? (
        <p>Loading tickets...</p>
      ) : (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <strong>{ticket.subject}</strong> - {ticket.status}
              <div>{ticket.description}</div>
              {ticket.status === 'open' && (
                <div>
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Write your response here..."
                  />
                  <button onClick={() => handleReply(ticket.id)}>
                    Reply and Close Ticket
                  </button>
                </div>
              )}
              {ticket.status === 'closed' && <div>Admin Reply: {ticket.response}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminSupportPage;
