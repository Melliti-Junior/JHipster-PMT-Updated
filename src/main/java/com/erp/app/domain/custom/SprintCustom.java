package com.erp.app.domain.custom;

import com.erp.app.domain.*;
import com.erp.app.domain.util.CascadeSave;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import java.io.Serializable;

@Entity
// @Document(collection = "sprint")
public class SprintCustom extends Sprint implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

    @DBRef
	@Field("board")
    // @JsonManagedReference
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
