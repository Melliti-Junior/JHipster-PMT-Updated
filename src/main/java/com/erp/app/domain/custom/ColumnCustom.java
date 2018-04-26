package com.erp.app.domain.custom;

import com.erp.app.domain.*;
import com.erp.app.domain.util.CascadeSave;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import java.io.Serializable;

@Entity
// @Document(collection = "Column")
public class ColumnCustom extends Column implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

    @DBRef
    @CascadeSave
    //@ManyToOne(fetch = FetchType.EAGER)
    @ManyToOne
	@Field("board")
    // @JsonManagedReference
    private BoardCustom board;

	public ColumnCustom(BoardCustom board) {
		super();
		this.board = board;
    }

	public ColumnCustom() {
		super();
	}

    public BoardCustom getBoard() {
        return board;
    }

    public void setBoard(BoardCustom board) {
        this.board = board;
    }
}
