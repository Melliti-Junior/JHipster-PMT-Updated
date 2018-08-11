package com.erp.app.web.rest.custom;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.custom.CustomBoard;
import com.erp.app.repository.custom.BoardCustomRepository;
import com.erp.app.repository.search.custom.BoardCustomSearchRepository;
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

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

@RestController
@RequestMapping("/api/custom")
public class BoardCustomResource {

	private final Logger log = LoggerFactory.getLogger(BoardCustomResource.class);

    private static final String ENTITY_NAME = "boardcustom";

    private final BoardCustomRepository boardcustomRepository;

    private final BoardCustomSearchRepository boardcustomSearchRepository;

    public BoardCustomResource(BoardCustomRepository boardcustomRepository, BoardCustomSearchRepository boardcustomSearchRepository) {
        this.boardcustomRepository = boardcustomRepository;
        this.boardcustomSearchRepository = boardcustomSearchRepository;
    }

    /**
     * POST  /boardcustoms : Create a new boardcustom.
     *
     * @param boardcustom the boardcustom to create
     * @return the ResponseEntity with status 201 (Created) and with body the new boardcustom, or with status 400 (Bad Request) if the boardcustom has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/boardcustoms")
    @Timed
    public ResponseEntity<CustomBoard> createBoardCustom(@Valid @RequestBody CustomBoard boardcustom) throws URISyntaxException {
        log.debug("REST request to save CustomBoard : {}", boardcustom);
        if (boardcustom.getId() != null) {
            throw new BadRequestAlertException("A new boardcustom cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CustomBoard result = boardcustomRepository.save(boardcustom);
        boardcustomSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/custom/boardcustoms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /boardcustoms : Updates an existing boardcustom.
     *
     * @param boardcustom the boardcustom to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated boardcustom,
     * or with status 400 (Bad Request) if the boardcustom is not valid,
     * or with status 500 (Internal Server Error) if the boardcustom couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/boardcustoms")
    @Timed
    public ResponseEntity<CustomBoard> updateBoardCustom(@Valid @RequestBody CustomBoard boardcustom) throws URISyntaxException {
        log.debug("REST request to update CustomBoard : {}", boardcustom);
        if (boardcustom.getId() == null) {
            return createBoardCustom(boardcustom);
        }
        CustomBoard result = boardcustomRepository.save(boardcustom);
        boardcustomSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, boardcustom.getId().toString()))
            .body(result);
    }

    /**
     * GET  /boardcustoms : get all the boardcustoms.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of boardcustoms in body
     */
    @GetMapping("/boardcustoms")
    @Timed
    public ResponseEntity<List<CustomBoard>> getAllBoardCustoms(Pageable pageable) {
        log.debug("REST request to get a page of BoardCustoms");
        Page<CustomBoard> page = boardcustomRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/custom/boardcustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /boardcustoms/:id : get the "id" boardcustom.
     *
     * @param id the id of the boardcustom to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the boardcustom, or with status 404 (Not Found)
     */
    @GetMapping("/boardcustoms/{id}")
    @Timed
    public ResponseEntity<CustomBoard> getBoardCustom(@PathVariable String id) {
        log.debug("REST request to get CustomBoard : {}", id);
        CustomBoard boardcustom = boardcustomRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(boardcustom));
    }

    /**
     * DELETE  /boardcustoms/:id : delete the "id" boardcustom.
     *
     * @param id the id of the boardcustom to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/boardcustoms/{id}")
    @Timed
    public ResponseEntity<Void> deleteBoardCustom(@PathVariable String id) {
        log.debug("REST request to delete CustomBoard : {}", id);
        boardcustomRepository.delete(id);
        boardcustomSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/boardcustoms?query=:query : search for the boardcustom corresponding
     * to the query.
     *
     * @param query the query of the boardcustom search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/boardcustoms")
    @Timed
    public ResponseEntity<List<CustomBoard>> searchBoardCustoms(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of BoardCustoms for query {}", query);
        Page<CustomBoard> page = boardcustomSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/custom/_search/boardcustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


}
