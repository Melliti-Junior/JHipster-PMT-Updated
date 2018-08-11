package com.erp.app.domain.custom;

import com.erp.app.domain.Sprint;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import java.io.Serializable;

@Entity
public class CustomSprint extends Sprint implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

    @DBRef
	@Field("board")
    private CustomBoard board;

	public CustomSprint(CustomBoard board) {
		super();
		this.board = board;
    }

	public CustomSprint() {
		super();
	}

    public CustomBoard getBoard() {
        return board;
    }

    public void setBoard(CustomBoard board) {
        this.board = board;
    }
}
