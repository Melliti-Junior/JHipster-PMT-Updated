package com.erp.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.IssuePriority;

import com.erp.app.repository.IssuePriorityRepository;
import com.erp.app.repository.search.IssuePrioritySearchRepository;
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
 * REST controller for managing IssuePriority.
 */
@RestController
@RequestMapping("/api")
public class IssuePriorityResource {

    private final Logger log = LoggerFactory.getLogger(IssuePriorityResource.class);

    private static final String ENTITY_NAME = "issuePriority";

    private final IssuePriorityRepository issuePriorityRepository;

    private final IssuePrioritySearchRepository issuePrioritySearchRepository;

    public IssuePriorityResource(IssuePriorityRepository issuePriorityRepository, IssuePrioritySearchRepository issuePrioritySearchRepository) {
        this.issuePriorityRepository = issuePriorityRepository;
        this.issuePrioritySearchRepository = issuePrioritySearchRepository;
    }

    /**
     * POST  /issue-priorities : Create a new issuePriority.
     *
     * @param issuePriority the issuePriority to create
     * @return the ResponseEntity with status 201 (Created) and with body the new issuePriority, or with status 400 (Bad Request) if the issuePriority has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/issue-priorities")
    @Timed
    public ResponseEntity<IssuePriority> createIssuePriority(@Valid @RequestBody IssuePriority issuePriority) throws URISyntaxException {
        log.debug("REST request to save IssuePriority : {}", issuePriority);
        if (issuePriority.getId() != null) {
            throw new BadRequestAlertException("A new issuePriority cannot already have an ID", ENTITY_NAME, "idexists");
        }
        IssuePriority result = issuePriorityRepository.save(issuePriority);
        issuePrioritySearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/issue-priorities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /issue-priorities : Updates an existing issuePriority.
     *
     * @param issuePriority the issuePriority to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated issuePriority,
     * or with status 400 (Bad Request) if the issuePriority is not valid,
     * or with status 500 (Internal Server Error) if the issuePriority couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/issue-priorities")
    @Timed
    public ResponseEntity<IssuePriority> updateIssuePriority(@Valid @RequestBody IssuePriority issuePriority) throws URISyntaxException {
        log.debug("REST request to update IssuePriority : {}", issuePriority);
        if (issuePriority.getId() == null) {
            return createIssuePriority(issuePriority);
        }
        IssuePriority result = issuePriorityRepository.save(issuePriority);
        issuePrioritySearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, issuePriority.getId().toString()))
            .body(result);
    }

    /**
     * GET  /issue-priorities : get all the issuePriorities.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of issuePriorities in body
     */
    @GetMapping("/issue-priorities")
    @Timed
    public ResponseEntity<List<IssuePriority>> getAllIssuePriorities(Pageable pageable) {
        log.debug("REST request to get a page of IssuePriorities");
        Page<IssuePriority> page = issuePriorityRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/issue-priorities");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /issue-priorities/:id : get the "id" issuePriority.
     *
     * @param id the id of the issuePriority to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the issuePriority, or with status 404 (Not Found)
     */
    @GetMapping("/issue-priorities/{id}")
    @Timed
    public ResponseEntity<IssuePriority> getIssuePriority(@PathVariable String id) {
        log.debug("REST request to get IssuePriority : {}", id);
        IssuePriority issuePriority = issuePriorityRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(issuePriority));
    }

    /**
     * DELETE  /issue-priorities/:id : delete the "id" issuePriority.
     *
     * @param id the id of the issuePriority to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/issue-priorities/{id}")
    @Timed
    public ResponseEntity<Void> deleteIssuePriority(@PathVariable String id) {
        log.debug("REST request to delete IssuePriority : {}", id);
        issuePriorityRepository.delete(id);
        issuePrioritySearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/issue-priorities?query=:query : search for the issuePriority corresponding
     * to the query.
     *
     * @param query the query of the issuePriority search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/issue-priorities")
    @Timed
    public ResponseEntity<List<IssuePriority>> searchIssuePriorities(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of IssuePriorities for query {}", query);
        Page<IssuePriority> page = issuePrioritySearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/issue-priorities");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
