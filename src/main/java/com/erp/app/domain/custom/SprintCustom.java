package com.erp.app.domain.custom;

import com.erp.app.domain.Sprint;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import java.io.Serializable;

@Entity
public class SprintCustom extends Sprint implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

    @DBRef
	@Field("board")
    private BoardCustom board;

	public SprintCustom(BoardCustom board) {
		super();
		this.board = board;
    }

	public SprintCustom() {
		super();
	}

    public BoardCustom getBoard() {
        return board;
    }

    public void setBoard(BoardCustom board) {
        this.board = board;
    }
}
