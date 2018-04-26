package com.erp.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.Column;

import com.erp.app.repository.ColumnRepository;
import com.erp.app.repository.search.ColumnSearchRepository;
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
 * REST controller for managing Column.
 */
@RestController
@RequestMapping("/api")
public class ColumnResource {

    private final Logger log = LoggerFactory.getLogger(ColumnResource.class);

    private static final String ENTITY_NAME = "column";

    private final ColumnRepository columnRepository;

    private final ColumnSearchRepository columnSearchRepository;

    public ColumnResource(ColumnRepository columnRepository, ColumnSearchRepository columnSearchRepository) {
        this.columnRepository = columnRepository;
        this.columnSearchRepository = columnSearchRepository;
    }

    /**
     * POST  /columns : Create a new column.
     *
     * @param column the column to create
     * @return the ResponseEntity with status 201 (Created) and with body the new column, or with status 400 (Bad Request) if the column has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/columns")
    @Timed
    public ResponseEntity<Column> createColumn(@Valid @RequestBody Column column) throws URISyntaxException {
        log.debug("REST request to save Column : {}", column);
        if (column.getId() != null) {
            throw new BadRequestAlertException("A new column cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Column result = columnRepository.save(column);
        columnSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/columns/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /columns : Updates an existing column.
     *
     * @param column the column to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated column,
     * or with status 400 (Bad Request) if the column is not valid,
     * or with status 500 (Internal Server Error) if the column couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/columns")
    @Timed
    public ResponseEntity<Column> updateColumn(@Valid @RequestBody Column column) throws URISyntaxException {
        log.debug("REST request to update Column : {}", column);
        if (column.getId() == null) {
            return createColumn(column);
        }
        Column result = columnRepository.save(column);
        columnSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, column.getId().toString()))
            .body(result);
    }

    /**
     * GET  /columns : get all the columns.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of columns in body
     */
    @GetMapping("/columns")
    @Timed
    public ResponseEntity<List<Column>> getAllColumns(Pageable pageable) {
        log.debug("REST request to get a page of Columns");
        Page<Column> page = columnRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/columns");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /columns/:id : get the "id" column.
     *
     * @param id the id of the column to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the column, or with status 404 (Not Found)
     */
    @GetMapping("/columns/{id}")
    @Timed
    public ResponseEntity<Column> getColumn(@PathVariable String id) {
        log.debug("REST request to get Column : {}", id);
        Column column = columnRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(column));
    }

    /**
     * DELETE  /columns/:id : delete the "id" column.
     *
     * @param id the id of the column to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/columns/{id}")
    @Timed
    public ResponseEntity<Void> deleteColumn(@PathVariable String id) {
        log.debug("REST request to delete Column : {}", id);
        columnRepository.delete(id);
        columnSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/columns?query=:query : search for the column corresponding
     * to the query.
     *
     * @param query the query of the column search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/columns")
    @Timed
    public ResponseEntity<List<Column>> searchColumns(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Columns for query {}", query);
        Page<Column> page = columnSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/columns");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
