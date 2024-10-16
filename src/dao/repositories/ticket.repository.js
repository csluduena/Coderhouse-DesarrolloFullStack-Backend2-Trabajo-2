import Ticket from '../models/ticket.model.js';

export class TicketRepository {
    async create(ticketData) {
        const ticket = new Ticket(ticketData);
        await ticket.save();
        return ticket;
    }

    async findByCode(code) {
        return await Ticket.findOne({ code });
    }

    async findAll() {
        return await Ticket.find();
    }
}