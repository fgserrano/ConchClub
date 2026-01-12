package com.conchclub.repository;

import com.conchclub.model.Ticket;
import org.springframework.jdbc.core.BeanPropertyRowMapper;

public class TicketRowMapper extends BeanPropertyRowMapper<Ticket> {
    public TicketRowMapper() {
        super(Ticket.class);
    }
}
