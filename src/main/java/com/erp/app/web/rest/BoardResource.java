package com.erp.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.Board;

import com.erp.app.repository.BoardRepository;
import com.erp.app.repository.search.BoardSearchRepository;
import com.erp.app.web.rest.errors.BadRequestAlertException;
import com.erp.app.web.rest.util.HeaderUtil;
import com.erp.app.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Board.
 */
@RestController
@RequestMapping("/api")
public class BoardResource {

    private final Logger log = LoggerFactory.getLogger(BoardResource.class);

    private static final String ENTITY_NAME = "board";

    private final BoardRepository boardRepository;

    private final BoardSearchRepository boardSearchRepository;

    public BoardResource(BoardRepository boardRepository, BoardSearchRepository boardSearchRepository) {
        this.boardRepository = boardRepository;
        this.boardSearchRepository = boardSearchRepository;
    }

    /**
     * POST  /boards : Create a new board.
     *
     * @param board the board to create
     * @return the ResponseEntity with status 201 (Created) and with body the new board, or with status 400 (Bad Request) if the board has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/boards")
    @Timed
    public ResponseEntity<Board> createBoard(@Valid @RequestBody Board board) throws URISyntaxException {
        log.debug("REST request to save Board : {}", board);
        if (board.getId() != null) {
            throw new BadRequestAlertException("A new board cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Board result = boardRepository.save(board);
        boardSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/boards/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /boards : Updates an existing board.
     *
     * @param board the board to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated board,
     * or with status 400 (Bad Request) if the board is not valid,
     * or with status 500 (Internal Server Error) if the board couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/boards")
    @Timed
    public ResponseEntity<Board> updateBoard(@Valid @RequestBody Board board) throws URISyntaxException {
        log.debug("REST request to update Board : {}", board);
        if (board.getId() == null) {
            return createBoard(board);
        }
        Board result = boardRepository.save(board);
        boardSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, board.getId().toString()))
            .body(result);
    }

    /**
     * GET  /boards : get all the boards.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of boards in body
     */
    @GetMapping("/boards")
    @Timed
    public ResponseEntity<List<Board>> getAllBoards(Pageable pageable) {
        log.debug("REST request to get a page of Boards");
        Page<Board> page = boardRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/boards");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /boards/:id : get the "id" board.
     *
     * @param id the id of the board to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the board, or with status 404 (Not Found)
     */
    @GetMapping("/boards/{id}")
    @Timed
    public ResponseEntity<Board> getBoard(@PathVariable String id) {
        log.debug("REST request to get Board : {}", id);
        Board board = boardRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(board));
    }

    /**
     * DELETE  /boards/:id : delete the "id" board.
     *
     * @param id the id of the board to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/boards/{id}")
    @Timed
    public ResponseEntity<Void> deleteBoard(@PathVariable String id) {
        log.debug("REST request to delete Board : {}", id);
        boardRepository.delete(id);
        boardSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/boards?query=:query : search for the board corresponding
     * to the query.
     *
     * @param query the query of the board search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/boards")
    @Timed
    public ResponseEntity<List<Board>> searchBoards(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Boards for query {}", query);
        Page<Board> page = boardSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/boards");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
